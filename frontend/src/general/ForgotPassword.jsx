import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/forgot-password', { email });
      alert('Password reset link sent to your email.');
    } catch (error) {
      console.error(error);
      alert('Error sending password reset link.');
    }
  };

  return (
    <div className="reset-password-page">
      <div className="main-container">
        <div className="main-title">
          <h2>Forgot Password</h2>
        </div>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-input">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="submit-container">
            <button type="submit">Sent Reset Link</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
