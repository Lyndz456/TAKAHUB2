const pool = require('../config/db');

// Submit a new pickup request
const submitPickupRequest = async (req, res) => {
  const { pickup_date, location, waste_type } = req.body;
  const user_id = req.user.user_id;

  try {
    // Prevent duplicate on same date
    const existing = await pool.query(
      'SELECT * FROM systempickuprequests WHERE user_id = $1 AND pickup_date = $2',
      [user_id, pickup_date]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Pickup already requested for this date.' });
    }

    const result = await pool.query(
      `INSERT INTO systempickuprequests (user_id, pickup_date, location, waste_type, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [user_id, pickup_date, location, waste_type]
    );

    res.status(201).json({
      message: 'Pickup request submitted',
      request: result.rows[0],
    });

  } catch (error) {
    console.error('Error creating pickup request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Accept a pickup request
const acceptPickupRequest = async (req, res) => {
  const { request_id } = req.body;

  try {
    const result = await pool.query(
      `UPDATE systempickuprequests 
       SET status = 'accepted' 
       WHERE request_id = $1 AND status = 'pending' 
       RETURNING *`,
      [request_id]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Request not found or already accepted.' });
    }

    res.status(200).json({
      message: 'Pickup request accepted',
      request: result.rows[0],
    });
  } catch (error) {
    console.error('Error accepting pickup:', error);
    res.status(500).json({ error: 'Failed to accept pickup request' });
  }
};

// Mark a pickup request as completed
const markPickupCompleted = async (req, res) => {
  const { request_id } = req.body;

  try {
    const result = await pool.query(
      'UPDATE systempickuprequests SET status = $1 WHERE request_id = $2',
      ['completed', request_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    res.status(200).json({ message: 'Pickup marked as completed.' });
  } catch (error) {
    console.error('Error updating pickup status:', error);
    res.status(500).json({ error: 'Failed to update pickup status' });
  }
};

// Fetch pickup requests for collector (pending + accepted)
const getAllPickupsForCollector = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.user_name AS resident_name
       FROM systempickuprequests p
       JOIN systemusers u ON p.user_id = u.user_id
       WHERE p.status IN ('pending', 'accepted')
       ORDER BY p.pickup_date ASC`
    );

    res.status(200).json({ requests: result.rows });
  } catch (error) {
    console.error('Error fetching pickup requests:', error);
    res.status(500).json({ error: 'Failed to fetch pickups' });
  }
};

// Fetch pickup requests for current resident
const getMyPickupRequests = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const result = await pool.query(
      `SELECT * FROM systempickuprequests WHERE user_id = $1 ORDER BY pickup_date DESC`,
      [user_id]
    );

    res.status(200).json({ requests: result.rows });
  } catch (error) {
    console.error('Error fetching resident pickup requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

module.exports = {
  submitPickupRequest,
  acceptPickupRequest,
  markPickupCompleted,
  getAllPickupsForCollector,
  getMyPickupRequests
};
