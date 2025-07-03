const express = require('express');
const router = express.Router();
const { submitWasteSorting } = require('../controllers/wasteController');

// Route to submit waste sorting record
router.post('/submit', submitWasteSorting);

module.exports = router;
