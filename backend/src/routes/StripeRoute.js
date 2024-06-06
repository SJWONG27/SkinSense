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
    const customer = await stripe.customers.create({
      metadata: {
        userId,
        cart: JSON.stringify(cartItems),
      },
    });

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "myr",
        product_data: {
          name: item.name,
          images: [item.image],
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer: customer.id,
      success_url: `${process.env.CLIENT_URL}/transaction/Success`,
      cancel_url: `${process.env.CLIENT_URL}/shoppingcart`,
    });

    res.send({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;


