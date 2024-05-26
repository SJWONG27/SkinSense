import React, { useState } from 'react';
import './generalIndex.css'
import logo from '../assets/images/logo_skinsense.png';
import { FaUser } from "react-icons/fa";
import { FaLock } from 'react-icons/fa';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/login', formData);
      if (response.status === 200) {
        navigate('/buyerPage');
      } else {
        alert('Failed to sign in. Please try again.');
      }
    } catch (error) {
        console.error('Error: ', error);
        alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
        <div className="login-page">
            <div className="logo-container">
                <img src={logo} alt="logo" />
            </div>

            <div className="main-container">
                <div className="main-title">
                    <h2>Login</h2>
                </div>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                    <div className="form-input">
                        <FaUser className="icon"/>
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required/>
                    </div>
                    <div className="form-input">
                        <FaLock className="icon"/>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
                    </div>
                    <div className="remember-forgot-password">
                        <label><input type="checkbox" />Remember Me</label>
                        <Link>Forgot Password?</Link>
                    </div>
                    <div className="submit-container">
                        <button type="submit">LOGIN</button>
                    </div>
                    <div className="sign-up">Don't Have an Account? <Link to="/register">Sign Up Here</Link></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;