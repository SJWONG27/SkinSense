import React from 'react'
import './Footer.css';
import { useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation();
    const hideFooter = location.pathname === '/' || location.pathname === '/register' || location.pathname==='/forgot-password' ||location.pathname.startsWith('/reset-password');
    if (hideFooter) {
        return null; // Render nothing if the footer should be hidden
      }
  return (
    
    <div className='footer' id='footer'>
    <div className="footer-content">
        <div className="footer-content-left">
                <img src="src/assets/images/small logo.png" alt="" />
                <p>Discover a world of skincare indulgence with our curated collection, featuring everything from timeless favorites to intriguing global treasures. Elevate your beauty routine and uncover the perfect products to pamper your skin.</p>
                <div className="footer-social-icons">
                    <img src="src/assets/images/facebook_icon.png" alt="" />
                    <img src="src/assets/images/twitter_icon.png" alt="" />
                    <img src="src/assets/images/linkedin_icon.png" alt="" />
                </div>
            </div>
            <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
            </div>
            <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+123456789</li>
                        <li>contact@skinense.com</li>
                    </ul>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">Copyright 2024 @ skinsense.com -All Right Reserved.</p>
    </div>
  )
}

export default Footer

