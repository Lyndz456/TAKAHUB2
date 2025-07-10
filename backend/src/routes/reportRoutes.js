const express = require('express');
const router = express.Router();
const {
  reportIllegalDumpsite,
  getResidentDumpsiteReports,
  getAllDumpsiteReports,
  markDumpsiteResolved
} = require('../controllers/reportController');
const verifyToken = require('../middleware/authMiddleware');

// Resident submits
router.post('/illegal-dumpsite', verifyToken, reportIllegalDumpsite);

// Resident views their own reports
router.get('/my-reports', verifyToken, getResidentDumpsiteReports);

// Municipal views all
router.get('/all-reports', verifyToken, getAllDumpsiteReports);

// Municipal marks report resolved
router.post('/resolve', verifyToken, markDumpsiteResolved);

module.exports = router;
