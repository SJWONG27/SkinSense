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
    <div className="reset-password-page">
      <div className="main-container">
        <div className="main-title">
          <h2>Reset Password</h2>
        </div>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-input">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
            />
          </div>
          <div className="submit-container">
            <button type="submit">Reset Password</button>
          </div>
        </form>
      </div>
    </div >
  );
};

export default ResetPassword;
