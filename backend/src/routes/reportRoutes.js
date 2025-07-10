const express = require('express');
const router = express.Router();
const { reportIllegalDumpsite } = require('../controllers/reportController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // ✅ import multer config

// ✅ Use upload.single('image') for file handling
router.post('/illegal-dumpsite', verifyToken, upload.single('image'), reportIllegalDumpsite);

module.exports = router;
