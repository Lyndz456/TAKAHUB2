const pool = require('../config/db');

// Get user by user_id (since login now uses user_id)
const getUserById = async (user_id) => {
  const result = await pool.query(
    'SELECT * FROM systemusers WHERE user_id = $1',
    [user_id]
  );
  return result.rows[0];
};

// Register new user
const registerUser = async ({ user_id, user_name, user_email, user_phone_number, hashedPassword }) => {
  const result = await pool.query(
    `INSERT INTO systemusers 
      (user_id, user_name, user_email, user_phone_number, user_password)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, user_name, user_email, user_phone_number, hashedPassword]
  );
  return result.rows[0];
};

module.exports = {
  getUserById,
  registerUser,
};
