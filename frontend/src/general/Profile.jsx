import React, { useEffect, useState } from 'react';
import defaultProfilePhoto from '../assets/images/img_avatar.jpeg';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [image, setImage] = useState(defaultProfilePhoto); 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  useEffect(() => {
    const verifyCookie = async () => {
      
      const {data} = await axios.post(
        "http://localhost:4000/",
        {},
        {withCredentials: true}
      );

      const {status, user, email} = data;
      setUsername(user);
      setEmail(email);
      setPhoneNumber(user.phoneNumber);
      setGender(user.gender);
      setDateOfBirth(user.dateOfBirth);
      setImage(user.profilePic || defaultProfilePhoto);
      return status
        ? toast(`Hello ${user}`, {
          position:"top-right",
        })
        : (removeCookie("token"), navigate("/login"), console.log('meow'));
      
      };
      verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('gender', gender);
    const imageFile = document.getElementById('imageUpload').files[0];
    if (imageFile) {
      formData.append('profilePic', imageFile);
    }

    try {
      await axios.put('http://localhost:4000/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${cookies.token}`
        }
      });
      toast('Changes saved!', { type: 'success' });
    } catch (error) {
      console.error('Failed to update profile', error);
      toast('Failed to update profile', { type: 'error' });
    }
  };


  const handleLogout = () => {
    removeCookie("token");
    navigate('/');
  };

  return (
    <div className="profile-form">
      <div className="photo-container">
        <img src={image} alt="profile photo" />
        <div className="upload-image-button">
          <input type="file" id="imageUpload" hidden onChange={handleImageChange} accept="image/*" />
          <label htmlFor="imageUpload">Change Image</label>
        </div>
      </div>
      <div className="form-container">
        <form onSubmit={handleSaveChanges}>
          <div className="form-input">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-input">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-input">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="tel" name="phone-number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div className="form-input">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input type="date" name="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </div>
          <div className="form-input-gender">
            <label htmlFor="gender">Gender</label>
            <div className="radio-group">
              <label htmlFor="male" className="radio-label">
                <input type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} />
                Male
              </label>
              <label htmlFor="female" className='radio-label'>
                <input type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} />
                Female
              </label>
              <label htmlFor="other" className='radio-label'>
                <input type="radio" id="other" name="gender" value="other" checked={gender === 'other'} onChange={(e) => setGender(e.target.value)} />
                Other
              </label>
            </div>
          </div>
          <div className='submit-container'>
            <button type="submit">Save changes</button>
          </div>
        </form>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;
