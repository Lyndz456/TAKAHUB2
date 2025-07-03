const express = require('express');
const router = express.Router();
const {
  submitPickupRequest,
  editPickupRequest,
  cancelPickupRequest
} = require('../controllers/pickupController');


router.post('/submit', submitPickupRequest);
router.put('/edit/:request_id', editPickupRequest);
router.delete('/cancel/:request_id', cancelPickupRequest);


module.exports = router;
