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
      `INSERT INTO systempickuprequests (user_id, pickup_date, location, waste_type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
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

module.exports = {
  submitPickupRequest
};
