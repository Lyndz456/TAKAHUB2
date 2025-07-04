// userController.js
const db = require('../config/db'); // adjust path as needed
const bcrypt = require('bcrypt');

const generateUserId = async (role) => {
  let prefix;

  switch (role.toLowerCase()) {
    case 'resident': prefix = 'R'; break;
    case 'collector': prefix = 'C'; break;
    case 'municipal authority': prefix = 'M'; break;
    case 'admin': prefix = 'SA'; break;
    default: throw new Error('Invalid role');
  }

  const result = await db.query(
    'SELECT COUNT(*) FROM systemusers WHERE user_id LIKE $1',
    [`${prefix}%`]
  );

  const count = parseInt(result.rows[0].count, 10);
  return `${prefix}${count + 1}`;
};

exports.registerUser = async (req, res) => {
  const { user_name, user_email, user_password, user_phone_number, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(user_password, 10);
    const user_id = await generateUserId(role);

    await db.query(
      'INSERT INTO systemusers (user_id, user_name, user_email, user_password, user_phone_number) VALUES ($1, $2, $3, $4, $5)',
      [user_id, user_name, user_email, hashedPassword, user_phone_number]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: { user_id, user_name, user_email, role }
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

