const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const {
  reportIllegalDumpsite,
  getAllDumpsiteReports,
  getResidentDumpsiteReports,
  markDumpsiteResolved,
  getDumpsiteStats
} = require('../controllers/reportController');

// ✅ Submit new dumpsite report
router.post('/illegal-dumpsite', verifyToken, reportIllegalDumpsite);

// ✅ Get all reports (for municipal authority)
router.get('/illegal-dumpsite', verifyToken, getAllDumpsiteReports);

// ✅ Get stats (total & unresolved)
router.get('/illegal-dumpsite/stats', verifyToken, getDumpsiteStats);

// ✅ Get logged-in resident's reports
router.get('/my-reports', verifyToken, getResidentDumpsiteReports);

// ✅ Resolve a report (by ID in URL)
router.put('/resolve', verifyToken, markDumpsiteResolved);

module.exports = router;
