const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Admin adds new collector or municipal authority
const addSystemUser = async (req, res) => {
  try {
    const { user_name, user_email, user_phone_number, user_password, user_role } = req.body;

    // Only allow specific roles
    if (!['collector', 'municipal', 'admin'].includes(user_role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const result = await pool.query(
      `INSERT INTO systemusers (user_name, user_email, user_phone_number, user_password, user_role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_name, user_email, user_phone_number, hashedPassword, user_role]
    );

    res.status(201).json({
      message: `${user_role} added successfully`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addSystemUser
};
