const express = require('express');
const router = express.Router();
const { getUserRewards } = require('../controllers/rewardController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/:user_id', verifyToken, getUserRewards);

module.exports = router;
