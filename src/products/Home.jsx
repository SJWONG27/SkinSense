import React from 'react';
import lotion from '../assets/images/logo_skinsense.png'
import './product.css';
import LocomotiveScroll from 'locomotive-scroll';
import { useEffect } from 'react';

function Home(){

  const scrollRef = React.createRef();

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true
    });
  });

  
  return(
    <div className='homeContainer'>
      
      <div className='scroll' ref={scrollRef}>
      <br/>
      <h1 className='scrollTitle' data-scroll data-scroll-speed="1" data-scroll-position="top" data-scroll-direction="horizontal">
      Welcome to Our Shop!
      </h1>
      <img className='scrollImg 'data-scroll data-scroll-speed="2" data-scroll-position="top"  data-scroll-direction="horizontal" src={lotion}></img>
   
      
      </div>
       
    </div>
  );
}



export default Home;