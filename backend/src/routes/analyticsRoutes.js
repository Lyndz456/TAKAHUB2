const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Analytics endpoints
router.get('/waste-summary', analyticsController.getWasteSummary);
router.get('/rewards-summary', analyticsController.getRewardsSummary);
router.get('/top-users', analyticsController.getTopUsers);

module.exports = router;
