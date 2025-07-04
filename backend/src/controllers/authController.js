const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.loginUser = async (req, res) => {
  const { user_id, user_password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM systemusers WHERE user_id = $1',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid user ID or password' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid user ID or password' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
