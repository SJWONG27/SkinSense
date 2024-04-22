import React, { useEffect } from 'react';
import { BsBagCheckFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import './Success.css';
import confetti from 'canvas-confetti';

const Success = () => {

  const runFireworks = () => {
    var duration = 1.5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
  
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
  
      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }

  useEffect(() => {
    runFireworks();
  }, []);

    const navigate = useNavigate();

    const handleContinueShopping = () => {
        // Navigate to the home page
        navigate('/Home');
      };

    return (
        <div className="success-container">
          <div className="success-frame">
            <div className="message">
              <h2>Thank you for your purchase!</h2>
              <p className="email-msg">Check your email inbox for the receipt.</p>
              <p className="description">If you have any questions, please email <a href="mailto:orders@example.com" className="email-address">orders@example.com</a>.</p>
            </div>
            <div className="continue-shopping">
              <button className="continue-shopping-btn" onClick={handleContinueShopping}>Continue Shopping</button>
            </div>
          </div>
        </div>
      )
    }
    
    export default Success;
