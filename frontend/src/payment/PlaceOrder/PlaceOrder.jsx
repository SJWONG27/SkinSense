import React, { useState, useEffect } from 'react';
import './PlaceOrder.css'
import { useNavigate,useLocation } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const stripePromise = loadStripe('pk_test_51P6u1x011mWT6ad4nb8H1uIBx9KKPLrjNxVuJ5TPXoAdeVrjkucxdAP7zoRMUsSGntXoOtDh01FbgCRizoTfwWAK00c00ZOowc');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');
    const [phone, setPhone] = useState('');
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);
    const [isSaved, setIsSaved] = useState(false); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);


// Retrieve the subtotal from location state
const { subtotal } = location.state || { subtotal: 0 };
const deliveryFee = subtotal === 0 ? 0 : 5;

useEffect(() => {
  const parsedSubtotal = parseFloat(subtotal);
  if (!isNaN(parsedSubtotal)) {
    const calculatedTotal = parsedSubtotal + deliveryFee - discount;
    setTotal(calculatedTotal);
  }
}, [subtotal, deliveryFee, discount]);

    // Calculate the total
    useEffect(() => {
        const calculatedTotal = subtotal + 5 - 0; // Include delivery fee and discount
        setTotal(calculatedTotal);
    }, [subtotal]);

    useEffect(() => {
        const calculatedTotal = subtotal + deliveryFee - discount;
        setTotal(calculatedTotal);
    }, [subtotal, deliveryFee, discount]);

    useEffect(() => {
        const savedDeliveryInfo = JSON.parse(localStorage.getItem('deliveryInfo'));

        if (savedDeliveryInfo) {
            const {
                firstName,
                lastName,
                email,
                street,
                city,
                state,
                zipCode,
                country,
                phone
            } = savedDeliveryInfo;

            setFirstName(firstName);
            setLastName(lastName);
            setEmail(email);
            setStreet(street);
            setCity(city);
            setState(state);
            setZipCode(zipCode);
            setCountry(country);
            setPhone(phone);
            setIsSaved(true); 
        }
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Check if any of the required fields are empty
        if (
            !firstName ||
            !lastName ||
            !email ||
            !street ||
            !city ||
            !state ||
            !zipCode ||
            !country ||
            !phone 
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        const deliveryInfo = {
            firstName,
            lastName,
            email,
            street,
            city,
            state,
            zipCode,
            country,
            phone
        };

        localStorage.setItem('deliveryInfo', JSON.stringify(deliveryInfo));
        setIsSaved(true);
        setShowSuccessMessage(true); 
    };

    const navigateToStripeCheckout = async () => {
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

    const validateForm = () => {
        return (
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            email.trim() !== '' &&
            street.trim() !== '' &&
            city.trim() !== '' &&
            state.trim() !== '' &&
            zipCode.trim() !== '' &&
            country.trim() !== '' &&
            phone.trim() !== ''
        );
    };

    const handlePromoCodeSubmit = (e) => {
        e.preventDefault();

        if (promoCode === "EXAMPLE") {
            setDiscount(subtotal * 0.1); 
        }
    };

    const calculateTotal = () => {
        return subtotal + deliveryFee - discount;
    };


    useEffect(() => {
        setIsSaved(false); 
        setShowSuccessMessage(false);
    }, []);

  return (
    <form className='place-order' onSubmit={handleFormSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
            <input type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />{firstName.trim() === '' && <p className="error-message">**</p>}
            <input type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />{lastName.trim() === '' && <p className="error-message">**</p>}
        </div>
        {email.trim() === '' && <p className="error-message">**</p>}
        <input type="email" placeholder='Email address' value={email} onChange={(e) => setEmail(e.target.value)} />
        {street.trim() === '' && <p className="error-message">**</p>}
        <input type="text" placeholder='Street' value={street} onChange={(e) => setStreet(e.target.value)} />
        <div className="multi-fields">
            <input type="text" placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} />{city.trim() === '' && <p className="error-message">**</p>}
            <input type="text" placeholder='State' value={state} onChange={(e) => setState(e.target.value)} />{state.trim() === '' && <p className="error-message">**</p>}
        </div>
        <div className="multi-fields">
            <input type="text" placeholder='Zip Code' value={zipCode} onChange={(e) => setZipCode(e.target.value)} />{zipCode.trim() === '' && <p className="error-message">**</p>}
            <input type="text" placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} />{country.trim() === '' && <p className="error-message">**</p>}
        </div>
        {phone.trim() === '' && <p className="error-message">**</p>}
        <input type="text" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="save-button-container">
    <button className='save-button' type="submit">{isSaved ? "Saved" : "Save"}</button>
    {showSuccessMessage && <p className="success-message">Saved successfully!</p>}
</div>
            </div>
      <div className="palce-order-right">
        <div className='cart-total'>
            <h2>Cart Totals</h2>
            <div>
                <div className="cart-total-details">
                    <p>Subtotal</p>
                    <p>RM{subtotal}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                    <p>Delivery Fee</p>
                    <p>RM{deliveryFee}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                    <p>Discount</p>
                    <p>RM{discount}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                    <b>Total</b>
                    <b>RM{total}</b>
                </div>
            </div>
        </div>
        <div className="cart-promocode">
            <div>
                <p>If you have a coupon, Enter it here</p>
                <div className='cart-promocode-input'>
                    <input type="text" placeholder='Promo Code' value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                    <button onClick={handlePromoCodeSubmit}>Apply Promo Code</button>
                </div>
            </div>
        </div>
        <button className="proceed-to-payment-button" onClick={() => {
            if (!validateForm()) {
                return;
          }    
          const calculatedTotal = calculateTotal();
            setTotal(calculatedTotal); 
            navigateToStripeCheckout();   
}}>PROCEED TO PAYMENT</button>
      </div>
    </form>
  )
}

export default PlaceOrder;

