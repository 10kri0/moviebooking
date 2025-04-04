const express = require('express');
const router = express.Router();
const { 
    createStripeSession, 
    createPhonePeSession, 
    handlePhonePeCallback 
} = require('../controllers/paymentController');

router.post('/create-stripe-session', createStripeSession);
router.post('/create-phonepe-session', createPhonePeSession);
router.post('/phonepe/callback', handlePhonePeCallback);

module.exports = router;