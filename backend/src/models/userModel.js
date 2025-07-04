const pool = require('../config/db');

// Get user by custom user_id (e.g., R1, C1, SA2)
const getUserById = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM systemusers WHERE user_id = $1',
    [user_id]
  );
  return result.rows[0];
};

// Get all users
const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT user_id, user_name, user_email, user_phone_number, created_at
     FROM systemusers
     ORDER BY created_at DESC`
  );
  return result.rows;
};

// Optionally: Get all users by role prefix (e.g., all collectors = 'C%')
const getUsersByRolePrefix = async (prefix) => {
  const result = await pool.query(
    `SELECT user_id, user_name, user_email, user_phone_number
     FROM systemusers
     WHERE user_id LIKE $1
     ORDER BY user_id`,
    [`${prefix}%`]
  );
  return result.rows;
};

module.exports = {
  getUserById,
  getAllUsers,
  getUsersByRolePrefix, // optional and helpful for role-based management
};

