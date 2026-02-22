const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Points to your database connection

// This handles: POST http://localhost:5000/api/requests

// 1. GET ALL PENDING REQUESTS (For Admin Dashboard)
router.get('/pending', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM Blood_Request WHERE status = 'Pending' ORDER BY created_at ASC"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. FIFO FULFILLMENT: Link Request to Inventory
router.post('/fulfill/:request_id', async (req, res) => {
    const { request_id } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Get request details
        const requestReq = await client.query(
            "SELECT blood_group, component_type FROM Blood_Request WHERE request_id = $1 AND status = 'Pending'",
            [request_id]
        );

        if (requestReq.rowCount === 0) {
            throw new Error("Request not found or already fulfilled.");
        }

        const { blood_group, component_type } = requestReq.rows[0];

        // FIFO: Find the OLDEST available unit matching criteria
        // We join with Donation to check blood_group
        const inventorySearch = await client.query(
            `SELECT i.inventory_id 
             FROM Blood_Inventory i
             JOIN Donation d ON i.donation_id = d.donation_id
             JOIN Donor dr ON d.donor_id = dr.donor_id
             WHERE dr.blood_group = $1 
             AND i.component_type = $2 
             AND i.status = 'Available'
             AND i.expiry_date > CURRENT_DATE
             ORDER BY i.collection_date ASC LIMIT 1`,
            [blood_group, component_type]
        );

        if (inventorySearch.rowCount === 0) {
            throw new Error("No matching blood units available in inventory.");
        }

        const inventory_id = inventorySearch.rows[0].inventory_id;

        // Create the Issue record
        // This triggers 'trg_validate_issue' in your DB which updates statuses
        await client.query(
            `INSERT INTO Blood_Issue (inventory_id, request_id, issue_date) 
             VALUES ($1, $2, CURRENT_DATE)`,
            [inventory_id, request_id]
        );

        await client.query('COMMIT');
        res.json({ message: "Request fulfilled successfully using FIFO matching." });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ message: err.message });
    } finally {
        client.release();
    }
});
router.post('/', async (req, res) => {
    try {
        const { requester_name, blood_group, component_type, quantity } = req.body;

        const newRequest = await pool.query(
            `INSERT INTO Blood_Request 
             (requester_name, blood_group, component_type, quantity) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [requester_name, blood_group, component_type, quantity]
        );

        res.status(201).json(newRequest.rows[0]);

    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;