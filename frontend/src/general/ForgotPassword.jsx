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
    <div className="main-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
