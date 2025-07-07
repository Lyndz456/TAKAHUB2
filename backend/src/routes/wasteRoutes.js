const express = require('express');
const router = express.Router();
const { submitWasteSorting, getRewardStats } = require('../controllers/wasteController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/sort', verifyToken, submitWasteSorting);
router.get('/stats', verifyToken, getRewardStats); // ✅ Needed for resident dashboard

module.exports = router;
