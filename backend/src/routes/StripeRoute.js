const express = require("express");
const Stripe = require("stripe");
const { Order } = require("../models/orderModel");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);
const router = express.Router();
router.use(express.json());

router.post("/create-checkout-session", async (req, res) => {
  const { cartItems, userId, couponCode } = req.body; // Add couponCode to request body

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    console.error("Cart items are required and should be an array.");
    return res.status(400).send({ error: "Cart items are required and should be an array." });
  }

  // Sample coupon data
  const coupons = [
    { code: "EXAMPLE", discountPercentage: 10 },
    // Add more coupon codes here if needed
  ];

  try {
    // Calculate subtotal
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

    // Apply coupon if couponCode is provided
    let discountedTotal = subtotal;
    if (couponCode) {
      const coupon = coupons.find((coupon) => coupon.code === couponCode);
      if (coupon) {
        const discountAmount = (subtotal * coupon.discountPercentage) / 100;
        discountedTotal = subtotal - discountAmount;
      }
    }

    const customer = await stripe.customers.create({
      metadata: {
        userId,
        cart: JSON.stringify(cartItems),
      },
    });

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

    // Apply discount directly in the line items
    if (couponCode) {
      line_items.push({
        price_data: {
          currency: "myr",
          product_data: {
            name: "Discount", // Name for the discount line item
          },
          unit_amount: -discountedTotal * 100, // Negative amount for discount
        },
        quantity: 1, // Quantity of 1 for the discount line item
      });
    }

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

    res.send({ sessionId: session.id, discountedTotal });
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
