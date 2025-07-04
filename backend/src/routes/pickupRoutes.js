const express = require('express');
const router = express.Router();
const {
  submitPickupRequest,
  editPickupRequest,
  cancelPickupRequest
} = require('../controllers/pickupController');
const verifyToken = require('../middleware/authMiddleware');


router.post('/book', verifyToken, submitPickupRequest);

router.put('/edit/:request_id', verifyToken, editPickupRequest);

router.delete('/cancel/:request_id', verifyToken, cancelPickupRequest);

module.exports = router;
