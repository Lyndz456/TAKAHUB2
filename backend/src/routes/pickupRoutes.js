const express = require('express');
const router = express.Router();
const {
  submitPickupRequest,
  acceptPickupRequest,
  rejectPickupRequest,
  markPickupCompleted,
  getAllPickupsForCollector,
  getMyPickupRequests,
  updatePickupRequest,     // ✅ new
  deletePickupRequest      // ✅ new
} = require('../controllers/pickupController');

const verifyToken = require('../middleware/authMiddleware');

// Resident submits a pickup request
router.post('/submit', verifyToken, submitPickupRequest);

// Collector accepts a pickup request
router.post('/accept', verifyToken, acceptPickupRequest);

// Collector rejects a pickup request
router.post('/reject', verifyToken, rejectPickupRequest);

// Collector marks request as completed
router.post('/complete', verifyToken, markPickupCompleted);

// Collector fetches all pickup requests
router.get('/collector', verifyToken, getAllPickupsForCollector);

// Resident fetches their pickup requests
router.get('/my-requests', verifyToken, getMyPickupRequests);

// ✅ Resident edits pending request
router.put('/edit/:id', verifyToken, updatePickupRequest);

// ✅ Resident deletes pending request
router.delete('/delete/:id', verifyToken, deletePickupRequest);

module.exports = router;
