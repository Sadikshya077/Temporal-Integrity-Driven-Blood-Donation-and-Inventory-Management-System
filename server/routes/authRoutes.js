const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// POST: Login for Admin/Staff
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // We use double quotes because "User" is a reserved keyword in Postgres
        const query = 'SELECT * FROM "User" WHERE username = $1';
        const result = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }

        const user = result.rows[0];

        // Direct password comparison (⚠ In production, use bcrypt!)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Send back user info and role (Admin or Staff)
       // Inside authRoutes.js login
        res.json({
            id: user.user_id,
            username: user.username,
            role: user.role
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;