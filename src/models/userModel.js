const pool = require('../config/db');

// Get user by ID
const getUserById = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM systemusers WHERE user_id = $1',
    [user_id]
  );
  return result.rows[0];
};

// Get all users
const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM systemusers');
  return result.rows;
};

module.exports = {
  getUserById,
  getAllUsers,
};
