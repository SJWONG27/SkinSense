import React, { useState } from 'react';
import './generalIndex.css'
import logo from '../assets/images/logo_skinsense.png';
import { FaUser } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { email, password, username } = formData;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const { data } = await axios.post(
          "http://localhost:4000/signup",
          {
            ...formData,
          },
          { withCredentials: true }
        );
        const { success, message } = data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          handleError(message);
        }
      } catch (error) {
        console.log(error);
      }
      setFormData({
        ...formData,
        email: "",
        password: "",
        username: "",
      });
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
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleOnChange} required/>
                    </div>
                    <div className="form-input">
                        <MdEmail className="icon"/>
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleOnChange} required/>
                    </div>
                    <div className="form-input">
                        <FaLock className="icon"/>
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleOnChange} required/>
                    </div>
                    <div className="form-input">
                        <FaLock className="icon"/>
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleOnChange} required/>
                    </div>
                    <div className="agreement">
                        <label><input type="checkbox" />I agree to SkinSense's <span className='agreement-subtitle' style={{ color: '#f19f9e' }}>Terms of Use & Privacy Policy</span></label>
                    </div>
                    <div className="submit-container">
                        <button type="submit">SIGN UP</button>
                    </div>
                    <div className="login">Already Have an Account? <Link to="/"><a href="#">Login Here</a></Link></div>
                    </form>
                    <ToastContainer/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Register;