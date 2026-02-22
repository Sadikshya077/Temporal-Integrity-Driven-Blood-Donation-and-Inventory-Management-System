const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM "blood_center" ORDER BY center_name ASC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Center error:", err.message);
        res.status(500).json({ error: "Failed to fetch centers" });
    }
});

module.exports = router;