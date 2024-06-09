import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './PlaceOrder.css';
import mastercardImg from "../../assets/images/mastercard.png";
import payoneerImg from "../../assets/images/payoneer.png";
import visaImg from '../../assets/images/visa.png';
import maestroImg from '../../assets/images/maestro.png';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const PlaceOrder = () => {
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
    const [total, setTotal] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState(''); 
    const [isSaved, setIsSaved] = useState(false); 
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [discount, setDiscount] = useState(0);
    const navigate = useNavigate();
    const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);



    // Retrieve the subtotal from location state
    const { subtotal, cartItems } = location.state || { subtotal: 0, cartItems: [] };

    useEffect(() => {
        const parsedSubtotal = parseFloat(subtotal);
        if (!isNaN(parsedSubtotal)) {
            setTotal(parsedSubtotal);
        }
    }, [subtotal]);

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
            const requestData = {
                userId: 'exampleUserId',
                cartItems: cartItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    cartQuantity: item.quantity,
                    image: item.image,
                    id: item.id,
                }))
            };

            // Include coupon code if provided
            if (promoCode) {
                requestData.couponCode = promoCode;
            }

            const response = await axios.post('http://localhost:4000/api/stripe/create-checkout-session', requestData);
            const { sessionId } = response.data;

            const result = await stripe.redirectToCheckout({ sessionId });

            if (result.error) {
                console.error('Stripe checkout error:', result.error.message);
            }
        } catch (error) {
            console.error('Error during checkout process:', error.message);
        }
    };

    const handlePlaceOrder = async () => {
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
    
        const orderData = {
            userId: 'exampleUserId', // Replace with the actual user ID
            cartItems: cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                id: item.id
            })),
            paymentMethod: paymentMethod
        };
    
        try {
            await axios.post('http://localhost:4000/orders', orderData);
            setShowSuccessSnackbar(true);
            setTimeout(() => {
                setShowSuccessSnackbar(false);
                navigate('/transaction/Success');
            }, 3000); // Adjust the duration as needed (in milliseconds)
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };
    const handlePlaceOrderCashOnDelivery = () => {
        // Your logic for placing the order with cash on delivery goes here
        
        // Show the success Snackbar
        setShowSuccessSnackbar(true);
    
        // Hide the Snackbar and navigate after a delay
        setTimeout(() => {
            setShowSuccessSnackbar(false);
            navigate('/transaction/Success');
        }, 3000); // Adjust the duration as needed (in milliseconds)
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

    const handlePromoCodeSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make an API request to your backend to validate and apply the promo code
            const response = await axios.post('http://localhost:4000/api/apply-promo-code', {
                promoCode: promoCode
            });

            // Assuming the response contains the discounted total amount
            const { discountedTotal, discountAmount } = response.data;

            // Update the UI with the discounted total amount and discount amount
            setTotal(discountedTotal);
            setDiscount(discountAmount);
        } catch (error) {
            console.error('Error applying promo code:', error.message);
            // Handle any errors or display a message to the user
        }
    };

    return (
        <form className='place-order' onSubmit={handleFormSubmit}>
            <div className="place-order-left">
                <p className="title">Delivery Information</p>
                <div className="multi-fields">
                    <input type="text" placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    {firstName.trim() === '' && <p className="error-message">**</p>}
                    <input type="text" placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    {lastName.trim() === '' && <p className="error-message">**</p>}
                </div>
                {email.trim() === '' && <p className="error-message">**</p>}
                <input type="email" placeholder='Email address' value={email} onChange={(e) => setEmail(e.target.value)} />
                {street.trim() === '' && <p className="error-message">**</p>}
                <input type="text" placeholder='Street' value={street} onChange={(e) => setStreet(e.target.value)} />
                <div className="multi-fields">
                    <input type="text" placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} />
                    {city.trim() === '' && <p className="error-message">**</p>}
                    <input type="text" placeholder='State' value={state} onChange={(e) => setState(e.target.value)} />
                    {state.trim() === '' && <p className="error-message">**</p>}
                </div>
                <div className="multi-fields">
                    <input type="text" placeholder='Zip Code' value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                    {zipCode.trim() === '' && <p className="error-message">**</p>}
                    <input type="text" placeholder='Country' value={country} onChange={(e) => setCountry(e.target.value)} />
                    {country.trim() === '' && <p className="error-message">**</p>}
                </div>
                {phone.trim() === '' && <p className="error-message">**</p>}
                <input type="text" placeholder='Phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
                <div className="save-button-container">
                    <button className='save-button' type="submit">{isSaved ? "Saved" : "Save"}</button>
                    {showSuccessMessage && <p className="success-message">Saved successfully!</p>}
                </div>
            </div>
            <div className="place-order-right">
            <p className="title">Payment Method</p>
                <div className="cart-total">
                <h5>Price</h5>
                    <div className="cart-total-details">
                        <p>Cart Subtotal</p>
                        <p>RM{subtotal}</p>
                    </div>
                    <hr/>
                    <div className="payment-options">
                    <h5>Payment</h5>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                checked={paymentMethod === 'cash'}
                                onChange={() => setPaymentMethod('cash')}
                                onClick={handlePlaceOrder}
                            />
                            Cash on delivery
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                onClick={handlePlaceOrder}
                            />
                            Credit Card
                        </label>
                    </div>
                    <div className="payment-logos">
                        <img src={mastercardImg} alt="MasterCard" />
                        <img src={payoneerImg}  alt="Payoneer" />
                        <img src={visaImg}  alt="Visa" />
                        <img src={maestroImg}  alt="Maestro" />
                    </div>
                    <button className='place-order-button' onClick={paymentMethod === 'card' ? navigateToStripeCheckout : handlePlaceOrderCashOnDelivery}>
                        Place Order
                    </button>
                                {/* Snackbar for success message */}
            <Snackbar
                open={showSuccessSnackbar}
                autoHideDuration={6000} // Adjust duration as needed
                onClose={() => setShowSuccessSnackbar(false)}
            >
                <Alert
                    onClose={() => setShowSuccessSnackbar(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Order has been created successfully
                </Alert>
            </Snackbar>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
