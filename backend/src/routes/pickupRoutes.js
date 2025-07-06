const express = require('express');
const router = express.Router();
const { submitPickupRequest } = require('../controllers/pickupController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/submit', verifyToken, submitPickupRequest);

module.exports = router;
