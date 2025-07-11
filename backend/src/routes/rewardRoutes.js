const express = require('express');
const router = express.Router();
const {
  getUserRewards,
  getAllRewardLogs
} = require('../controllers/rewardController');
const verifyToken = require('../middleware/authMiddleware');

// 1. For residents to view their own rewards
router.get('/my-rewards', verifyToken, getUserRewards);

// 2. For admin to fetch all reward logs
router.get('/admin/logs', verifyToken, getAllRewardLogs);

module.exports = router;
