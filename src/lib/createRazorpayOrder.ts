import { razorpay } from "./razorpay";

export const createRazorpayOrder = async ({
  amount,
  currency,
  userId,
}: {
  amount: number; // in INR paise (e.g., 50000 = ₹500)
  currency: string;
  userId: string;
}) => {
  const order = await razorpay.orders.create({
    amount,
    currency,
    payment_capture: true,
    notes: {
      userId, // used later in webhook
    },
  });

  return order;
};
