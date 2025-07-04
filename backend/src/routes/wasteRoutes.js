const express = require('express');
const router = express.Router();
const { submitWasteSorting } = require('../controllers/wasteController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/sort', verifyToken, submitWasteSorting);

module.exports = router;

