const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();
router.get('/donations', protect, userController.getUserDonations);
module.exports = router;
