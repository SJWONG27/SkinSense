// Profile.jsx
import React, { useState } from 'react';
import defaultProfilePhoto from '../assets/images/img_avatar.jpeg'

const Profile = () => {
  const [image, setImage] = useState(defaultProfilePhoto); 
  const [username, setUsername] = useState('Jisoo');
  const [email, setEmail] = useState('jisoo0103@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    alert('Changes saved!');
  };

  return (

    <div className="profile-form">
        <div className="photo-container">
            <img src={image} alt="profile photo"/>
            <div className="upload-image-button">
                <input type="file" id="imageUpload" hidden onChange={handleImageChange} accept="image/*" />
                <label htmlFor="imageUpload">Change Image</label>
            </div>
        </div>
        <div className="form-container">
            <form>
                <div className="form-input">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                </div>
                <div className="form-input">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="form-input">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="tel" name="phone-number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                </div>
                <div className="form-input">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input type="date" name="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)}/>
                </div>
                <div className="form-input-gender">
                    <label htmlFor="gender">Gender</label>
                    <div className="radio-group">
                        <label htmlFor="male" className="radio-label">
                            <input type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)}/>
                            Male
                        </label>
                        <label htmlFor="female" className='radio-label'>
                            <input type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)}/>
                            Female
                        </label>
                        <label htmlFor="other" className='radio-label'>
                            <input type="radio" id="other" name="gender" value="other" checked={gender === 'other'} onChange={(e) => setGender(e.target.value)}/>
                            Other
                        </label>
                    </div>
                </div>
                <div className='submit-container'>
                    <button onClick={handleSaveChanges}>Save changes</button>
                </div>
            </form>
        </div>
    </div>

  );
};

export default Profile;