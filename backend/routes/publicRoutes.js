const express = require('express');
const router = express.Router();
const { 
  getPublicDonationEvents, 
  getPublicDonationEvent
} = require('../controllers/publicController');

router.get('/donation-events', getPublicDonationEvents);
router.get('/donation-events/:id', getPublicDonationEvent);

module.exports = router;
