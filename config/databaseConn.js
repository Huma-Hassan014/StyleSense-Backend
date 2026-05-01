const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// This will log a success message in your VS Code terminal
pool.on('connect', () => {
  console.log('✅ Connected to style_sensedb');
});

module.exports = pool;