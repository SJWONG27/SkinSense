import React, { useState } from 'react';
import './generalIndex.css'
import logo from '../assets/images/logo_skinsense.png';
import { FaUser } from "react-icons/fa";
import { FaLock } from 'react-icons/fa';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;
  
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
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(
        'http://localhost:4000/login', 
        {
          ...formData
        }, 
        { withCredentials: true }
      );
      console.log(data);
      const { success , message, _id, token, user } = data;
      if(success){
        handleSuccess(message);
        document.cookie = `token=${token}; path=/; HttpOnly`; 
        localStorage.setItem("email", JSON.stringify(email))    // store the currently logged-in email 
        localStorage.setItem("userId", JSON.stringify(_id));
        setTimeout(() =>{
          navigate("/buyerPage");
        }, 1000);
      }else{
        handleError(message);
      }
    } catch (error) {
        console.log('Error: ', error);
        handleError("Login failed, please try again.");
    }
    setFormData({
      ...formData,
      email: "",
      password: "",
    });
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
                        <input type="email" name="email" placeholder="Enter your email" value={email} onChange={handleOnChange} required/>
                    </div>
                    <div className="form-input">
                        <FaLock className="icon"/>
                        <input type="password" name="password" placeholder="Enter your Password" value={password} onChange={handleOnChange} required/>
                    </div>
                    <div className="remember-forgot-password">
                        <label><input type="checkbox" />Remember Me</label>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                    <div className="submit-container">
                        <button type="submit">LOGIN</button>
                    </div>
                    <div className="sign-up">Don't Have an Account? <Link to="/register">Sign Up Here</Link></div>
                    </form>
                    <ToastContainer/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Login;