const express = require('express');
const cors = require('cors');
require('dotenv').config();

//database connection
const pool = require('../DatabaseConn');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('StyleSense Backend is running!');
});

// Registration Route
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, reason } = req.body;

    // Standard SQL query to insert data into your 'users' table
    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone_no, password, reason) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [firstName, lastName, email, phoneNumber, password, reason]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    // Handle the "Unique Email" constraint you set in pgAdmin
    if (err.code === '23505') {
      return res.status(400).json({ error: "Email already exists!" });
    }
    res.status(500).json({ error: "Server error during registration" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});