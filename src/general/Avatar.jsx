import React from 'react';
import "../styles/index.css"

const Avatar = ({ photo, name }) => {
  return (
    <div className="avatar">
      <img src={photo} alt="User Avatar" className="avatar-image" />
      <span className="avatar-name">{name}</span>
    </div>
  );
};

export default Avatar;
