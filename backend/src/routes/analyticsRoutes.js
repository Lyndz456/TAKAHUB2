const express = require('express');
const router = express.Router();
const {
  getWasteSummary,
  getRewardsSummary,
  getTopUsers,
  getAdminStats
} = require('../controllers/analyticsController');

const verifyToken = require('../middleware/authMiddleware');

// Routes
router.get('/waste-summary', verifyToken, getWasteSummary);
router.get('/rewards-summary', verifyToken, getRewardsSummary);
router.get('/top-users', verifyToken, getTopUsers);
router.get('/admin-stats', verifyToken, getAdminStats);

module.exports = router;
