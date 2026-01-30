import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { cartItems } = req.body;

    // --- FIX: Use 'priceValue' (Number) instead of 'price' (String) ---
    const calculateOrderAmount = (items) => {
      const total = items.reduce((acc, item) => {
        // Ensure we use the number version of the price
        const price = item.priceValue || 0; 
        return acc + (price * item.quantity);
      }, 0);

      // Convert to cents (LKR 1790 -> 179000 cents)
      return Math.round(total * 100);
    };

    const amount = calculateOrderAmount(cartItems);

    // Safety Check: Ensure amount is valid
    if (amount < 50) { // Stripe requires a minimum amount (~$0.50)
        return res.status(400).json({ error: "Amount too low for transaction." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "lkr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Stripe Error:", error); // Log the actual error to your terminal
    res.status(500).json({ error: error.message });
  }
});

export default router;