const express = require('express');
const router = express.Router();
const { jwtAuthMiddleware } = require('../middleware/auth');
const { createOrder, paymentSuccess, handlePaymentWebhook } = require('../controllers/mainSettingControllers/paymentController');

router.post('/create-order', jwtAuthMiddleware, createOrder);
// router.post('/payment-success', jwtAuthMiddleware, paymentSuccess);

// Register the webhook route
router.post("/razorpay-webhook", handlePaymentWebhook);

module.exports = router;