import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51P6u1x011mWT6ad4nb8H1uIBx9KKPLrjNxVuJ5TPXoAdeVrjkucxdAP7zoRMUsSGntXoOtDh01FbgCRizoTfwWAK00c00ZOowc');

const Payment = () => {
  const handleClick = async () => {
    const stripe = await stripePromise;

    try {
      const response = await axios.post('http://localhost:4000/api/stripe/create-checkout-session', {
        userId: 'exampleUserId', // Replace with actual userId if needed
        cartItems: [
          { name: 'Item 1', price: 1000, cartQuantity: 1, image: 'image_url', desc: 'Description 1', id: 'item1' },
          { name: 'Item 2', price: 2000, cartQuantity: 2, image: 'image_url', desc: 'Description 2', id: 'item2' }
        ]
      });

      const { sessionId } = response.data;

      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        console.error('Stripe checkout error:', result.error.message);
      }
    } catch (error) {
      console.error('Error during checkout process:', error.message);
    }
  };

  return (
    <button onClick={handleClick}>
      Pay with Stripe
    </button>
  );
};

export default Payment;


