// ChangePassword.jsx
import React, { useState } from 'react';
import './generalIndex.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
 
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your registration logic here, like sending a request to the backend
    console.log('Form submitted:', formData);
  };

  return (
    <div className="change-password-page">
        <div className="change-password-title">
            <h2>Change Password</h2>
        </div>
        <div className="change-password-form">
            <div className="form-container">
                <form>
                    <div className="form-input">
                        <label htmlFor="oldPassword">Old Password</label>
                        <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required/>
                    </div>
                    <div className="form-input">
                        <label htmlFor="newPassword">New Password</label>
                        <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required/>
                    </div>
                    <div className="form-input">
                        <label htmlFor="confirmNewPassword">New Password</label>
                        <input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} required/>
                    </div>
                    <div className="forgot-password">
                        <a href="#">Forgot Password?</a>
                    </div>
                    <div className="submit-container">
                        <button type="submit">CHANGE PASSWORD</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default ChangePassword;