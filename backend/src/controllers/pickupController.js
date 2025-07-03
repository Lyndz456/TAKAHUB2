const pool = require('../config/db');

// Submit a new pickup request
const submitPickupRequest = async (req, res) => {
  try {
    const { user_id, pickup_date } = req.body;

    // Check if a request already exists for this user and date
    const existing = await pool.query(
      `SELECT * FROM systempickuprequests WHERE user_id = $1 AND pickup_date = $2`,
      [user_id, pickup_date]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Pickup request for this date already exists.' });
    }

    const result = await pool.query(
      `INSERT INTO systempickuprequests (user_id, pickup_date)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, pickup_date]
    );

    res.status(201).json({ message: 'Pickup request submitted', data: result.rows[0] });
  } catch (error) {
    console.error('Error submitting pickup request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Edit a request
const editPickupRequest = async (req, res) => {
  const { request_id } = req.params;
  const { pickup_date } = req.body;

  try {
    const updateQuery = `
      UPDATE systempickuprequests
      SET pickup_date = $1
      WHERE request_id = $2
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [pickup_date, request_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Pickup request not found" });
    }

    res.status(200).json({
      message: "Pickup request updated successfully",
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Error editing pickup request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//Delete a Request
const cancelPickupRequest = async (req, res) => {
  try {
    const { request_id } = req.params;

    const result = await pool.query(
      `DELETE FROM systempickuprequests
       WHERE request_id = $1
       RETURNING *`,
      [request_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    res.json({ message: 'Pickup request cancelled' });
  } catch (error) {
    console.error('Error canceling pickup request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  submitPickupRequest,
  editPickupRequest,
  cancelPickupRequest
};
