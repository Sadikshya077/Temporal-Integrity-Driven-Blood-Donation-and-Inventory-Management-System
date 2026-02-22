const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ==========================================
// 1. PUBLIC: REGISTER (Always 'Scheduled')
// ==========================================

// Add this above your /register route
// ==========================================
// 0. UTILITY: GET ALL CENTERS
// ==========================================
router.get('/centers', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT center_id, center_name, location FROM Blood_Center WHERE is_active = TRUE ORDER BY center_name ASC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching centers:", err.message);
        res.status(500).json({ error: "Failed to load blood centers" });
    }
});
router.post('/register', async (req, res) => {
    const { full_name, blood_group, contact, gender, donation_type, center_id, donation_date } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Upsert Donor
        const donorResult = await client.query(
            `INSERT INTO Donor (full_name, blood_group, contact, gender) 
             VALUES ($1, $2, $3, $4) 
             ON CONFLICT (contact) DO UPDATE SET full_name = EXCLUDED.full_name
             RETURNING donor_id`, [full_name, blood_group, contact, gender]
        );
        const donorId = donorResult.rows[0].donor_id;

        // Create Scheduled Donation
        await client.query(
            `INSERT INTO Donation (donor_id, donation_type, center_id, donation_date, status) 
             VALUES ($1, $2, $3, $4, 'Scheduled')`, [donorId, donation_type, center_id, donation_date] 
        );

        await client.query('COMMIT');
        res.json({ message: "Registration successful! Status: Scheduled." });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ message: err.message });
    } finally { client.release(); }
});

// ==========================================
// 2. ADMIN: CONFIRM (Moves to Inventory)
// ==========================================
router.patch('/confirm/:donation_id', async (req, res) => {
    try {
        // This triggers 'trg_donation_status_sync' which adds to Blood_Inventory
        const result = await pool.query(
            `UPDATE Donation SET status = 'Completed' 
             WHERE donation_id = $1 AND status = 'Scheduled' RETURNING *`,
            [req.params.donation_id]
        );
        if (result.rowCount === 0) return res.status(404).json({ message: "Record not found or already completed." });
        res.json({ message: "Donation verified. Blood added to inventory." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 3. ADMIN: DELETE DONOR (Wipes EVERYTHING)
// ==========================================
router.delete('/donor/:id', async (req, res) => {
    try {
        // CASCADE will delete: Donor -> Donation -> Blood_Inventory
        await pool.query('DELETE FROM Donor WHERE donor_id = $1', [req.params.id]);
        res.json({ message: "Donor and all associated records deleted." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 4. ADMIN: DELETE SPECIFIC DONATION
// ==========================================
router.delete('/donation/:id', async (req, res) => {
    try {
        // CASCADE will delete: Donation -> Blood_Inventory
        await pool.query('DELETE FROM Donation WHERE donation_id = $1', [req.params.id]);
        res.json({ message: "Donation and linked inventory record removed." });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;