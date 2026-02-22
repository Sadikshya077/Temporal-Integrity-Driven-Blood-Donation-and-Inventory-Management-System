const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/donations', async (req, res) => {
    const { donor_id, center_id, component_type, donation_type } = req.body;
    try {
        // 1. Insert the Donation
        // This triggers 'update_donor_eligibility' in your SQL
        const donationResult = await pool.query(
            'INSERT INTO donation (donor_id, center_id, donation_type) VALUES ($1, $2, $3) RETURNING *',
            [donor_id, center_id, donation_type || 'Voluntary']
        );

        const newDonationId = donationResult.rows[0].donation_id;

        // 2. Insert into Blood Inventory
        // This triggers 'set_blood_expiry' in your SQL
        const inventoryResult = await pool.query(
            'INSERT INTO blood_inventory (component_type, donation_id) VALUES ($1, $2) RETURNING *',
            [component_type, newDonationId]
        );

        res.json({ 
            success: true, 
            message: "Donation recorded and Inventory updated!",
            inventory: inventoryResult.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});
// Get all inventory records with Blood Group details
router.get('/inventory', async (req, res) => {
    try {
        const query = `
            SELECT 
                bi.inventory_id, 
                bi.component_type, 
                bi.expiry_date, 
                bi.status,
                dr.blood_group
            FROM "blood_inventory" bi
            JOIN donation d ON bi.donation_id = d.donation_id
            JOIN donor dr ON d.donor_id = dr.donor_id
            WHERE bi.status = 'Available'
            ORDER BY bi.expiry_date ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Inventory Fetch Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
router.get('/donations', async (req, res) => {
    try {
        const query = `
                    -- View for Admin to see what's due today
        SELECT d.*, dr.full_name 
        FROM donation d 
        JOIN donor dr ON d.donor_id = dr.donor_id
        WHERE d.donation_date = CURRENT_DATE 
        AND d.status = 'Scheduled'
        ORDER BY d.donation_id ASC;
        `;

        const result = await pool.query(query);
        res.json(result.rows);

    } catch (err) {
        console.error("Donations Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get('/requests', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM "blood_request" ORDER BY request_date DESC'
        );

        res.json(result.rows);

    } catch (err) {
        console.error("Requests Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
router.get('/centers', async (req, res) => {
    try {
        // Use double quotes if you see any errors in the terminal
        const result = await pool.query('SELECT * FROM "blood_center" ORDER BY center_name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Centres Fetch Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// GET Dashboard Statistics
router.get('/stats', async (req, res) => {
    try {
        // Get count of pending requests
        const pendingRes = await pool.query('SELECT COUNT(*) FROM blood_request WHERE status = \'Pending\'');
        
        // Get blood group counts from inventory (joining with donation/donor)
        const stockRes = await pool.query(`
            SELECT dr.blood_group, COUNT(*) as count 
            FROM blood_inventory bi
            JOIN donation d ON bi.donation_id = d.donation_id
            JOIN donor dr ON d.donor_id = dr.donor_id
            WHERE bi.status = 'Available'
            GROUP BY dr.blood_group
        `);

        res.json({
            pending: parseInt(pendingRes.rows[0].count),
            stock: stockRes.rows
        });
    } catch (err) {
        console.error("Stats Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// Add a new blood center (Admin only)
router.post('/centers', async (req, res) => {
    const { center_name, location } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO blood_center (center_name, location) VALUES ($1, $2) RETURNING *',
            [center_name, location]
        );
        res.json({ message: "Center added successfully", center: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove a center
router.delete('/centers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM blood_center WHERE center_id = $1', [id]);
        res.json({ message: "Center removed" });
    } catch (err) {
        res.status(500).json({ error: "Cannot delete center: It may have donation records attached." });
    }
});
// Update Blood Request Status
// ... existing imports

// REFINED FIFO REQUEST FULFILLMENT
// Complete a scheduled donation and move to inventory
router.patch('/donations/:id/complete', async (req, res) => {
    const { id } = req.params;
    const { component_type } = req.body; // Usually 'Whole Blood'

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Update Donation Status to 'Completed'
        const updateDonation = await client.query(
            "UPDATE donation SET status = 'Completed' WHERE donation_id = $1 AND status = 'Scheduled' RETURNING *",
            [id]
        );

        if (updateDonation.rows.length === 0) {
            throw new Error("Donation not found or already processed.");
        }

        // 2. Add to Blood Inventory
        // Your SQL trigger 'set_blood_expiry' will handle the expiry date automatically
        await client.query(
            'INSERT INTO blood_inventory (component_type, donation_id) VALUES ($1, $2)',
            [component_type || 'Whole Blood', id]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: "Donation completed and added to inventory!" });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

// GET AUDIT LOGS
router.get('/audit', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM inventory_audit_log ORDER BY action_time DESC LIMIT 50');
        res.json(result.rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});
// Get all donors for management
router.get('/donors', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM donor ORDER BY full_name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Remove a donor (Admin only)
router.delete('/donors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Note: This will fail if the donor has existing donation records due to Foreign Key constraints
        await pool.query('DELETE FROM donor WHERE donor_id = $1', [id]);
        res.json({ message: "Donor removed successfully" });
    } catch (err) {
        res.status(500).json({ error: "Cannot delete donor with active donation history." });
    }
});

router.delete('/donations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // This will cascade and delete inventory records automatically
        await pool.query('DELETE FROM donation WHERE donation_id = $1', [id]);
        res.json({ message: "Donation record and associated inventory purged." });
    } catch (err) {
        res.status(500).json({ error: "Cannot delete donation: Record may be linked to an issue log." });
    }
});

// // Update Request Status (Fulfill/Cancel)
// router.patch('/requests/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body; // 'Fulfilled' or 'Cancelled'
//         await pool.query('UPDATE blood_request SET status = $1 WHERE request_id = $2', [status, id]);
//         res.json({ message: "Request updated" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
module.exports = router;