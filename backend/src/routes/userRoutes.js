const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

// Public route
router.post('/', userController.registerUser);

// Protected route example
router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'This is a protected route',
    user: req.user
  });
});

module.exports = router;
