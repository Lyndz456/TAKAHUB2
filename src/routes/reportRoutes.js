const express = require('express');
const router = express.Router();
const { reportIllegalDumpsite } = require('../controllers/reportController');

router.post('/report', reportIllegalDumpsite);

module.exports = router;
