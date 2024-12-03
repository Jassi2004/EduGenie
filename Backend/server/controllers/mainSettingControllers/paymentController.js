const Razorpay = require("razorpay");
const express = require("express");
const User = require("../../models/user");  // Assuming your User model is in the models folder
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const crypto = require("crypto");

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.key_id, // Your Razorpay test key ID
    key_secret: process.env.key_secret, // Your Razorpay secret key
});

// Route to create a Razorpay order
const createOrder = async (req, res) => {
    const { planType, userId } = req.body; // Get the plan type and user ID from the request

    let amount = 0;
    if (planType === "weekly") {
        amount = 1000; // 10 INR in paise (Razorpay uses paise)
    } else if (planType === "monthly") {
        amount = 3500; // 35 INR in paise
    } else {
        return res.status(400).send("Invalid plan type");
    }

    // Create an order with Razorpay
    const options = {
        amount, // Amount in paise
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        const orderId = order.id; // Get the order ID from Razorpay

        // Send the order ID to the frontend so that Razorpay can handle the payment
        res.json({ orderId });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            message: "Error creating Razorpay order",
            error: error.message,
            details: error,
        });
    }
};

// Webhook to handle Razorpay payment success
const handlePaymentWebhook = async (req, res) => {
    const { paymentId, orderId, userId, planType } = req.body;

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;  // This should be set in your Razorpay account settings

    // Verify the webhook signature
    const signature = req.headers["x-razorpay-signature"];
    const payload = JSON.stringify(req.body);

    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(payload)
        .digest("hex");

    if (signature !== expectedSignature) {
        return res.status(400).send("Webhook signature verification failed.");
    }

    // Now, verify the payment
    try {
        const payment = await razorpay.payments.fetch(paymentId);

        if (payment.order_id === orderId && payment.status === "captured") {
            const user = await User.findById(userId);
            if (!user) return res.status(404).send("User not found");

            user.planType = planType;

            if (planType === "weekly") {
                user.planExpiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Set expiry date 7 days from now
            }

            if (planType === "monthly") {
                user.planExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Set expiry date 30 days from now
            }

            if (planType === "premium") {
                user.isPremium = true; // Mark user as premium
            }

            await user.save();
            res.send("Payment successful, plan updated.");
        } else {
            res.status(400).send("Payment verification failed.");
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).send("Error verifying payment");
    }
};


module.exports = { createOrder, handlePaymentWebhook };
