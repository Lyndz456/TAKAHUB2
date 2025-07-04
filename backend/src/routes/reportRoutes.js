const express = require('express');
const router = express.Router();
const { reportIllegalDumpsite } = require('../controllers/reportController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/illegal-dumpsite', verifyToken,  reportIllegalDumpsite);

module.exports = router;
