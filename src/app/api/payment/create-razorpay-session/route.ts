import Razorpay from 'razorpay';
import { NextRequest } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail } = await req.json();

    // Create order in Razorpay
    const options = {
      amount: 4900, // ₹49 in paise
      currency: 'INR',
      receipt: `receipt_order_${userId}_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return Response.json({ orderId: order.id });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}