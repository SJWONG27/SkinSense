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
  const [userId, setUserId] = useState(''); 

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
  
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
  
    return [year, month, day].join('-');
  }

  useEffect(() => {
    const verifyCookie = async () => {
      console.log('Cookie:', cookies.token); 
      try {
        const response = await axios.post(
          "http://localhost:4000/",
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`
            },
            withCredentials: true
          }
        );
  
        const { status, user } = response.data;
        console.log(response.data);
        if (status) {
          setUsername(user.username);
          setEmail(user.email);
          setPhoneNumber(user.phoneNumber);
          setGender(user.gender);
          setDateOfBirth(formatDate(user.dateOfBirth));
          setImage(user.profilePic ? getImgUrl(user.profilePic) : defaultProfilePhoto);
          setUserId(user._id);
          toast(`Hello ${user.username}`, { position: "top-right" });
        } else {
          removeCookie("token");
          navigate("/login");
          console.log('User verification failed');
        }
      } catch (error) {
        console.error('Verification error', error);
        navigate("/login");
      }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);  
  

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file); // Log the selected file
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
    formData.append('userId', userId); // Add userId to formData

    const imageFile = document.getElementById('imageUpload').files[0];
    if (imageFile) {
      console.log('Appending file to form data:', imageFile); // Log the file being appended
      formData.append('profilePic', imageFile);
    }
  
    try {
      const response = await axios.put(`http://localhost:4000/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${cookies.token}`
        },
        withCredentials: true
      });
      console.log('Server response:', response);
      
      if (response.status === 200) {
        toast('Changes saved!', { type: 'success' });
        setImage(response.data.user.profilePic ? getImgUrl(response.data.user.profilePic) : defaultProfilePhoto); // Update profile picture using getImgUrl
      } else {
        toast('Failed to update profile', { type: 'error' });
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      toast('Failed to update profile', { type: 'error' });
    }
  };  
  

  const handleLogout = () => {
    removeCookie("token");
    navigate('/');
  };

  // Function to get the URL and pass to "src" attribute in <img> tag
  const getImgUrl = (imgPath) => {
    return new URL(`../${imgPath.substring(15)}`, import.meta.url).href;
  }

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
