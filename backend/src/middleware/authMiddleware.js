const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // adjust path if needed

exports.loginUser = async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    // Step 1: Check if user exists
    const result = await db.query(
      'SELECT * FROM systemusers WHERE user_email = $1',
      [user_email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = result.rows[0]; // ✅ define user here

    // Step 2: Verify password
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Step 3: Generate JWT
    const token = jwt.sign(
      { id: user.user_id, email: user.user_email, role: user.user}, // payload
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Verifying in middleware
jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        email: user.user_email,
        role_id: user.role_id
      },
      token: token
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Define the function
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Export it
module.exports = verifyToken;



