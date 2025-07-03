const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.registerUser = async (req, res) => {
  const { user_name, user_email, user_phone_number, user_password, role_id } = req.body;

  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);

    const result = await db.query(
      `INSERT INTO systemusers 
        (user_name, user_email, user_phone_number, user_password, role_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_name, user_email, user_phone_number, hashedPassword, role_id]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
