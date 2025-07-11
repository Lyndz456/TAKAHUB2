// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, addUser } = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', registerUser);             // For residents
router.post('/create', verifyToken, addUser);       // For admins

module.exports = router;
