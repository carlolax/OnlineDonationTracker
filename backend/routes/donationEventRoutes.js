const express = require('express');
const router = express.Router();
const { 
  createDonationEvent, 
  getDonationEvents, 
  getDonationEvent, 
  updateDonationEvent, 
  deleteDonationEvent 
} = require('../controllers/donationEventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.route('/')
  .post(createDonationEvent)
  .get(getDonationEvents);

router.route('/:id')
  .get(getDonationEvent)
  .put(updateDonationEvent)
  .delete(deleteDonationEvent);

module.exports = router;
