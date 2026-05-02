const jwt = require('jsonwebtoken');
const pool = require('../config/databaseConn');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await pool.query(
      "SELECT * FROM sessions WHERE token = $1 AND is_active = TRUE",
      [token]
    );

    if (session.rows.length === 0) {
      return res.status(401).json({ error: "Session expired or logged out" });
    }

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;