const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

exports.createCheckoutSession = async (req, res) => {
    try {
        const { seats, totalPrice } = req.body;

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: seats.map(seat => ({
                price_data: {
                    currency: 'INR',
                    product_data: {
                        name: `Seat ${seat}`,
                    },
                    unit_amount: totalPrice * 100, // Amount in cents
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`, // Redirect URL after successful payment
            cancel_url: `${process.env.FRONTEND_URL}/cancel`, // Redirect URL if payment is canceled
        });

        res.status(200).json({ url: session.url }); // Return the checkout session URL
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.createPhonePeSession = async (req, res) => {
    try {
        const { totalAmount } = req.body;
        const merchantTransactionId = uuidv4();
        const merchantId = process.env.PHONEPE_MERCHANT_ID;
        const saltKey = process.env.PHONEPE_SALT_KEY;
        const saltIndex = process.env.PHONEPE_SALT_INDEX;
        const userId = req.user._id;

        const payload = {
            merchantId,
            merchantTransactionId,
            merchantUserId: userId,
            amount: totalAmount * 100, // Convert to paise
            redirectUrl: `${process.env.FRONTEND_URL}/payment-success`,
            redirectMode: "POST",
            callbackUrl: `${process.env.BACKEND_URL}/api/payment/phonepe/callback`,
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        const checksum = crypto
            .createHash('sha256')
            .update(base64Payload + '/pg/v1/pay' + saltKey)
            .digest('hex');
        
        const finalChecksum = checksum + '###' + saltIndex;

        const phonePeUrl = process.env.PHONEPE_URL + '/pg/v1/pay';

        const response = await axios.post(phonePeUrl, {
            request: base64Payload
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': finalChecksum,
                'accept': 'application/json'
            }
        });

        res.status(200).json({
            url: response.data.data.instrumentResponse.redirectInfo.url,
            transactionId: merchantTransactionId
        });
    } catch (error) {
        console.error('PhonePe error:', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};

exports.handlePhonePeCallback = async (req, res) => {
    try {
        const { transactionId } = req.body;
        const saltKey = process.env.PHONEPE_SALT_KEY;
        const saltIndex = process.env.PHONEPE_SALT_INDEX;
        
        const checksum = crypto
            .createHash('sha256')
            .update(`/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${transactionId}` + saltKey)
            .digest('hex');
        
        const finalChecksum = checksum + '###' + saltIndex;

        const statusUrl = `${process.env.PHONEPE_URL}/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${transactionId}`;
        
        const response = await axios.get(statusUrl, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': finalChecksum,
                'X-MERCHANT-ID': process.env.PHONEPE_MERCHANT_ID
            }
        });

        if(response.data.code === 'PAYMENT_SUCCESS') {
            // Update your database here
            return res.status(200).json({ success: true });
        }
        
        return res.status(400).json({ success: false });
    } catch (error) {
        console.error('Callback error:', error);
        res.status(500).json({ success: false });
    }
};

// Keep Stripe for other payment methods
exports.createStripeSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: { name: 'Movie Tickets' },
                    unit_amount: req.body.amount * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ message: 'Payment failed' });
    }
};