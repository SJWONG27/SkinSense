import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payment.css';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const { subtotal, deliveryFee, total } = location.state;
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardNumberError, setCardNumberError] = useState(false);
  const [expiryDateError, setExpiryDateError] = useState(false);
  const [cvvError, setCvvError] = useState(false);
  const [savedCardInfo, setSavedCardInfo] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaved, CardIsSaved] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
   
    const savedCard = JSON.parse(localStorage.getItem('savedCard'));
    if (savedCard) {
        setSavedCardInfo(savedCard);
        setCardNumber(savedCard.cardNumber);
        setExpiryDate(savedCard.expiryDate);
        setCvv(savedCard.cvv);
        CardIsSaved(true);
    }
}, []);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePaymentSubmit = () => {
    if (paymentMethod === 'cashOnDelivery') {
      navigate('/transaction/Success');
      return;
    }

    if (!cardNumber || !expiryDate || !cvv) {
      if (!cardNumber) setCardNumberError(true);
      if (!expiryDate) setExpiryDateError(true);
      if (!cvv) setCvvError(true);
      alert('Please fill in all required fields.');
      return;
    }

    console.log('Credit/Debit Card selected');
    console.log('Card Number:', cardNumber);
    console.log('Expiry Date:', expiryDate);
    console.log('CVV:', cvv);

    const cardInfo = { cardNumber, expiryDate, cvv };
    localStorage.setItem('savedCard', JSON.stringify(cardInfo));
    CardIsSaved(true);

    navigate('/transaction/Success');
    };

    const handleSaveCard = () => {
      const cardInfo = { cardNumber, expiryDate, cvv };
      localStorage.setItem('savedCard', JSON.stringify(cardInfo));
      CardIsSaved(true);
      setSuccessMessage('Card details saved successfully!');
    };

    const handleCardNumberChange = (e) => {
      let value = e.target.value;
      // Remove any non-numeric characters from the input
      value = value.replace(/\D/g, '');
      // Restrict input length to 16 characters
      value = value.substring(0, 16);
      // Add spaces after every 4 characters
      value = value.replace(/(.{4})/g, '$1 ');
      setCardNumber(value);
    };
    
    const handleExpiryDateChange = (e) => {
      let value = e.target.value;
      // Remove any non-numeric characters from the input
      value = value.replace(/\D/g, '');
      // Restrict input length to 6 characters
      value = value.substring(0, 6);
      // Format as MM/YYYY
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      setExpiryDate(value);
    };
    
    const handleCvvChange = (e) => {
      let value = e.target.value;
      // Remove any non-numeric characters from the input
      value = value.replace(/\D/g, '');
      // Restrict input length to 3 characters
      value = value.substring(0, 3);
      setCvv(value);
    };

    useEffect(() => {
      CardIsSaved(false); 
      setSuccessMessage(false);
  }, []);

  return (
    <div className='homeContainer'>
    <div className="payment-container">
      <div className="frame">
        <div className="section">
          <h1>Payment Method</h1>
          <div className="payment-options">
            <div
              className={`payment-option ${paymentMethod === 'cashOnDelivery' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('cashOnDelivery')}
            >
              Cash on Delivery
            </div>
            <div
              className={`payment-option ${paymentMethod === 'credit-debit-card' ? 'selected' : ''}`}
              onClick={() => handlePaymentMethodChange('credit-debit-card')}
            >
              Debit/Credit Card
            </div>
          </div>
        </div>
        <hr className="hr-line" />
        <div className="section">
          {paymentMethod === 'cashOnDelivery' && (
            <div>
              <h2 className="section-heading">Cash on Delivery</h2>
              <p className="section-content">Please ensure you have sufficient funds available upon the arrival of the delivery personnel at your residence.</p>
            </div>
          )}
          {paymentMethod === 'credit-debit-card' && (
            <div>
              <h2>Enter Card Details</h2>
              <input
                type="text"
                placeholder="Card Number"
                id='card Number'
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
              />
              {cardNumberError && <p className="error-message">Please enter the card number.</p>}
              <input
                type="text"
                placeholder="Expiry Date (MM/YYYY)"
                id='Expiry Date'
                value={expiryDate}
                onChange={handleExpiryDateChange}
                required
                />
              {expiryDateError && <p className="error-message">Please enter the expiry date.</p>}
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={handleCvvChange}
                required
              />
              {cvvError && <p className="error-message">Please enter the CVV.</p>}
              <button className="save-card-btn" onClick={handleSaveCard}> {isSaved ? "Saved" : "Save Card"}
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
          )}
        </div>
        <hr className="hr-line" />
        <div className="section">
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
                <b>Total</b>
                <b>RM{total}</b>
                </div>
            </div>
            <button className="place-order-btn" onClick={handlePaymentSubmit}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Payment;




