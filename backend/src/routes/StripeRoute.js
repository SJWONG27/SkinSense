const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/orderModel");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);
const router = express.Router();
router.use(express.json());

router.post("/create-checkout-session", async (req, res) => {
  const { cartItems, userId } = req.body;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    console.error("Cart items are required and should be an array.");
    return res.status(400).send({ error: "Cart items are required and should be an array." });
  }

  try {
    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

    // Create a customer on Stripe
    const customer = await stripe.customers.create({
      metadata: {
        userId,
        cart: JSON.stringify(cartItems),
      },
    });

    // Create line items for the checkout session
    const line_items = cartItems.map((item) => {
      const imageUrl = item.image && item.image.startsWith('http') ? item.image : 'https://via.placeholder.com/150'; // Placeholder image

      return {
        price_data: {
          currency: "myr",
          product_data: {
            name: item.name,
            images: [imageUrl],
            metadata: {
              id: item.id,
            },
          },
          unit_amount: item.price * 100,
        },
        quantity: item.cartQuantity,
      };
    });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer: customer.id,
      success_url: `${process.env.CLIENT_URL}/transaction/Success`,
      cancel_url: `${process.env.CLIENT_URL}/products`,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "myr",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1000,
              currency: "myr",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
    });

    // Send the session ID to the client
    res.send({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Route for handling successful payments
router.post("/payment/success", async (req, res) => {
  const { payment_method, customer } = req.body;

  try {
    // Attach the payment method to the customer
    const attachedPaymentMethod = await stripe.paymentMethods.attach(payment_method, {
      customer,
    });

    // Optionally, save the payment method ID or customer ID to your database
    // This allows you to charge the customer again in the future without collecting payment details again

    res.status(200).send("Payment method attached successfully.");
  } catch (error) {
    console.error("Error attaching payment method to customer:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;