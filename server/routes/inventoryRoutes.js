const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
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
        console.error("Inventory error:", err.message);
        res.status(500).json({ error: "Database connection failed" });
    }
});

module.exports = router;