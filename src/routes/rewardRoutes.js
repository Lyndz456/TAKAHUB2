const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');

// Route to get rewards for a specific user
router.get('/:user_id', rewardController.getUserRewards);

module.exports = router;
