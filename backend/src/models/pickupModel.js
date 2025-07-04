const pool = require('../config/db');

// Create new pickup request
const requestPickup = async ({ user_id, pickup_date }) => {
  const result = await pool.query(
    `INSERT INTO systempickuprequests 
      (user_id, pickup_date)
     VALUES ($1, $2) RETURNING *`,
    [user_id, pickup_date]
  );
  return result.rows[0];
};

// Get all pickup requests (ordered by latest)
const getAllPickups = async () => {
  const result = await pool.query(
    `SELECT * FROM systempickuprequests ORDER BY pickup_date DESC`
  );
  return result.rows;
};

module.exports = {
  requestPickup,
  getAllPickups,
};
