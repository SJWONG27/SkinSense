import React from 'react';
import "../styles/index.css"
import defaultProfilePic from '../assets/images/img_avatar.jpg'

const Avatar = ({ photo, name }) => {
  return (
    <div className="avatar">
      <img src={photo || defaultProfilePic} alt="User Avatar" className="avatar-image" />
      <span className="avatar-name">{name}</span>
    </div>
  );
};

export default Avatar;
