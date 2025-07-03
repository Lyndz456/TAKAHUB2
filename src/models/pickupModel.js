const pool = require('../config/db');

// Create new pickup request
const requestPickup = async ({ user_id, pickup_date, pickup_location, waste_type, notes }) => {
  const result = await pool.query(
    `INSERT INTO systempickups 
      (user_id, pickup_date, pickup_location, waste_type, notes)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, pickup_date, pickup_location, waste_type, notes]
  );
  return result.rows[0];
};

// Get all pickups
const getAllPickups = async () => {
  const result = await pool.query('SELECT * FROM systempickups ORDER BY pickup_date DESC');
  return result.rows;
};

module.exports = {
  requestPickup,
  getAllPickups,
};
