const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, showtimeId, seats } = req.body;

    const options = {
      amount: Math.round(amount), // Amount should be in paise
      currency: currency || 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        showtimeId,
        seats: JSON.stringify(seats)
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid signature' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Payment verified successfully'
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};