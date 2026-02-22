const express = require('express');
const cors = require('cors');

// 1. IMPORT THE POOL FIRST
const pool = require('./config/db'); 

// 2. NOW YOU CAN USE IT TO CHECK THE CONNECTION
pool.query('SELECT current_database()', (err, res) => {
    if (err) {
        console.error("❌ Database connection error:", err.message);
    } else {
        console.log("✅ Successfully connected to database:", res.rows[0].current_database);
    }
});

const donorRoutes = require('./routes/donorRoutes');
const requestRoutes = require('./routes/requestRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const centerRoutes = require('./routes/centerRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/donors', donorRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/centers', centerRoutes);

// 1. Register a new Donor
app.post('/donors', async (req, res) => {
    try {
        const { full_name, blood_group, contact, gender } = req.body;
        const newDonor = await pool.query(
            "INSERT INTO Donor (full_name, blood_group, contact, gender) VALUES($1, $2, $3, $4) RETURNING *",
            [full_name, blood_group, contact, gender]
        );
        res.json(newDonor.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Possible duplicate contact or database error");
    }
});

// 2. Add a Donation (The trigger will check eligibility automatically)
app.post('/donations', async (req, res) => {
    try {
        const { donor_id, donation_date, donation_type } = req.body;
        const newDonation = await pool.query(
            "INSERT INTO Donation (donor_id, donation_date, donation_type) VALUES($1, $2, $3) RETURNING *",
            [donor_id, donation_date, donation_type]
        );
        res.json(newDonation.rows[0]);
    } catch (err) {
        // This catches the RAISE EXCEPTION from your PostgreSQL function
        res.status(400).json({ error: err.message });
    }
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Search for the user in our PostgreSQL "User" table
        const user = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid Username" });
        }

        // Check if the password matches
        if (user.rows[0].password === password) {
            // Send back user info (except password) if successful
            const { password, ...userWithoutPassword } = user.rows[0];
            res.json(userWithoutPassword);
        } else {
            res.status(401).json({ message: "Invalid Password" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));