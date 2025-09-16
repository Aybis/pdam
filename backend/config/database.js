const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Initialize database tables
const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bills (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        period_month INTEGER NOT NULL,
        period_year INTEGER NOT NULL,
        previous_reading DECIMAL(10,2) DEFAULT 0,
        current_reading DECIMAL(10,2) NOT NULL,
        usage_m3 DECIMAL(10,2) GENERATED ALWAYS AS (current_reading - previous_reading) STORED,
        cost DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'unpaid',
        due_date DATE,
        paid_date DATE,
        meter_photo_path VARCHAR(500),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, period_month, period_year)
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };