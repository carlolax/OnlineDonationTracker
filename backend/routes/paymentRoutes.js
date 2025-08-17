const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-checkout-session', paymentController.createCheckoutSession);
router.post('/webhook', paymentController.handleWebhookEvent);
router.get('/verify-session/:sessionId', paymentController.verifySession);

module.exports = router;
