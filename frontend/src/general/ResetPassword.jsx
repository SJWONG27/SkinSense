import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4000/reset-password/${token}`, { password });
      alert('Password has been reset.');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Error resetting password.');
    }
  };

  return (
    <div className="main-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your new password"
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
