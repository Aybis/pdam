const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // Connect to default database first
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Create database if it doesn't exist
    await client.query(`
      SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'
    `).then(async (result) => {
      if (result.rows.length === 0) {
        await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log(`Database ${process.env.DB_NAME} created successfully`);
      } else {
        console.log(`Database ${process.env.DB_NAME} already exists`);
      }
    });
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    client.release();
  }

  // Connect to the actual database
  const appPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  const appClient = await appPool.connect();

  try {
    // Create tables
    await appClient.query(`
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

    await appClient.query(`
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

    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  } finally {
    appClient.release();
    await appPool.end();
  }

  await pool.end();
}

if (require.main === module) {
  initializeDatabase().then(() => {
    console.log('Database initialization completed');
    process.exit(0);
  }).catch((err) => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });
}

module.exports = { initializeDatabase };