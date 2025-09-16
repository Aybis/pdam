const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { calculateBillCost } = require('../utils/billCalculator');
const router = express.Router();

// Get all bills for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await pool.query(
      'SELECT * FROM bills WHERE user_id = $1 ORDER BY period_year DESC, period_month DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get bill by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM bills WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new bill
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      period_month,
      period_year,
      previous_reading,
      current_reading,
      due_date,
      notes
    } = req.body;

    // Calculate usage and cost
    const usage = current_reading - (previous_reading || 0);
    const cost = calculateBillCost(usage);

    const result = await pool.query(
      `INSERT INTO bills (user_id, period_month, period_year, previous_reading, current_reading, cost, due_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, period_month, period_year, previous_reading || 0, current_reading, cost, due_date, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating bill:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ message: 'Bill for this period already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

// Update bill
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;
    const {
      period_month,
      period_year,
      previous_reading,
      current_reading,
      status,
      due_date,
      paid_date,
      notes
    } = req.body;

    // Calculate usage and cost
    const usage = current_reading - (previous_reading || 0);
    const cost = calculateBillCost(usage);

    const result = await pool.query(
      `UPDATE bills SET 
       period_month = $1, period_year = $2, previous_reading = $3, current_reading = $4,
       cost = $5, status = $6, due_date = $7, paid_date = $8, notes = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 AND user_id = $11 RETURNING *`,
      [period_month, period_year, previous_reading || 0, current_reading, cost, status, due_date, paid_date, notes, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete bill
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM bills WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get dashboard data (usage vs cost chart data)
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    
    const result = await pool.query(
      `SELECT period_month, period_year, usage_m3, cost 
       FROM bills 
       WHERE user_id = $1 
       ORDER BY period_year, period_month 
       LIMIT 12`,
      [userId]
    );

    const chartData = result.rows.map(bill => ({
      period: `${bill.period_year}-${String(bill.period_month).padStart(2, '0')}`,
      usage: parseFloat(bill.usage_m3),
      cost: parseFloat(bill.cost)
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;