const express = require('express');
const router = express.Router();
const {
  submitPickupRequest,
  acceptPickupRequest,
  markPickupCompleted,
  getAllPickupsForCollector,
  getMyPickupRequests
} = require('../controllers/pickupController');
const verifyToken = require('../middleware/authMiddleware');

// Resident submits a pickup request
router.post('/submit', verifyToken, submitPickupRequest);

// Collector accepts a pickup request
router.post('/accept', verifyToken, acceptPickupRequest);

// Collector marks request as completed
router.post('/complete', verifyToken, markPickupCompleted);

// Collector fetches all pickup requests (pending + accepted)
router.get('/collector', verifyToken, getAllPickupsForCollector);

// Resident fetches their pickup history
router.get('/my-requests', verifyToken, getMyPickupRequests);

module.exports = router;

