import React from 'react';
import lotion from '../assets/images/lotion.png'
import './product.css';

function Home(){
  return(
    <div className='homeContainer'>
      <h1>Welcome to Our Shop!</h1>
      <p>Explore a wide range of amazing products.</p>
      <img src={lotion}/>
    </div>
  );
}



export default Home;