const express = require('express');
const router = express.Router();
const {
  getWasteSummary,
  getRewardsSummary,
  getTopUsers
} = require('../controllers/analyticsController');

const verifyToken = require('../middleware/authMiddleware');

// Routes
router.get('/waste-summary', verifyToken, getWasteSummary);
router.get('/rewards-summary', verifyToken, getRewardsSummary);
router.get('/top-users', verifyToken, getTopUsers);

module.exports = router;
