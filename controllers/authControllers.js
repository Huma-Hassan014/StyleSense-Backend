//"brain" of the logic for authentication and authorization
const pool = require('../config/databaseConn'); // Points to your db file
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, reason } = req.body;

    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone_no, password, reason) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email`,
      [firstName, lastName, email, phoneNumber, hashedPassword, reason]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" });
    }

    await pool.query(
      "UPDATE sessions SET is_active = FALSE WHERE user_id = $1 AND is_active = TRUE",
      [user.rows[0].id]
    );

    const token = jwt.sign(
      { id: user.rows[0].id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    await pool.query(
      `INSERT INTO sessions (user_id, token, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 hour')`,
      [user.rows[0].id, token]
    );

    res.json({
      success: true,
      token,
      user: { id: user.rows[0].id, email: user.rows[0].email }
    });

  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(400).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const result = await pool.query(
      "UPDATE sessions SET is_active = FALSE WHERE token = $1",
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Invalid token" });
    }

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (err) {
    res.status(500).json({ error: "Server error during logout" });
  }
};
