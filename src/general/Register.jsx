import React, { useState } from 'react';
import './generalIndex.css'
import logo from '../assets/images/logo_skinsense.png';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    console.log('Form submitted:', formData);
  };

  return (
    <div>
        <div className="sign-up-page">
            <div className="logo-container">
                <img src={logo} alt="logo" />
            </div>

            <div className="main-container">
                <div className="main-title">
                    <h2>Sign Up</h2>
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                    <div className="form-input">
                        <FaUser className="icon"/>
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required/>
                    </div>
                    <div className="form-input">
                        <MdEmail className="icon"/>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
                    </div>
                    <div className="form-input">
                        <FaLock className="icon"/>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
                    </div>
                    <div className="form-input">
                        <FaLock className="icon"/>
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required/>
                    </div>
                    <div className="agreement">
                        <label><input type="checkbox" />I agree to SkinSense's <span className='agreement-subtitle' style={{ color: '#f19f9e' }}>Terms of Use & Privacy Policy</span></label>
                    </div>
                    <div className="submit-container">
                        <button type="submit">SIGN UP</button>
                    </div>
                    <div className="login">Already Have an Account? <Link to="/"><a href="#">Login Here</a></Link></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Register;