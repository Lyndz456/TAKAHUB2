const pool = require('../config/db');

// Get user by email for login
const getUserByEmail = async (email) => {
  const result = await pool.query(
    'SELECT * FROM systemusers WHERE user_email = $1',
    [email]
  );
  return result.rows[0];
};

// Register new user
const registerUser = async ({ user_name, user_email, user_phone_number, hashedPassword, role_id }) => {
  const result = await pool.query(
    `INSERT INTO systemusers 
      (user_name, user_email, user_phone_number, user_password, role_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [user_name, user_email, user_phone_number, hashedPassword, role_id]
  );
  return result.rows[0];
};

module.exports = {
  getUserByEmail,
  registerUser,
};
