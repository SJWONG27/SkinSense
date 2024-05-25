import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; 
import cleanser from '../assets/images/cleanser.png'
import lotion from '../assets/images/lotion.png'
import toner from '../assets/images/toner.png'
import mois from '../assets/images/mois.png'
import cleanser2 from '../assets/images/cleanser2.jpg'
import './product.css';

function ProductList({filter, sort}){

const [records, setRecords] = useState([]);
  // This method fetches the product records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:4000/product/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
  
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

    // not used
    const products2 = [
         {name: 'lotion', price: 'RM100.00', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', src:lotion, brand:"HAAN body lotion", stars:5} ,
        { name: 'moisturiser', price: 'RM400.00', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', src:mois, brand:"Aveeno Moisturiser", stars:3} ,
        {name: 'cleanser', price: 'RM300.00', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' , src:cleanser, brand:"Neutrogena Cleanser", stars:1},
        { name: 'toner', price: 'RM200.00', description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", src:toner , brand:"Thayers Witch Hazel Toner", stars:2},
        { name: 'cleanser', price: 'RM75.00', description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", src:cleanser2 , brand:"Garnier Cleanser", stars:4}
    ]  

    // not used
    const [products, setProducts] = useState([
        { name: 'Lotion', price: 'RM100', description: '...' },
        { name: 'Moisturiser', price: 'RM400', description: '...' },
        { name: 'Cleansers', price: 'RM300', description: '...' },
        { name: 'Toners', price: 'RM200', description: '...' },
      ]);
    
    
      if(sort=="price-asc"){
        const sortedProducts = sortProductsByPriceAsc(records); // Sort before rendering

      return (
        <div>
          {sortedProducts.map((product) => (
            <ProductCard name={product.name} filter={filter} price={product.price} description={product.description} imgsrc={product.img} brand={product.name} stars={product.stars}/> // Spread product data to ProductCard
          ))}
        </div>
      );
    }

    else if(sort=="price-desc"){
        const sortedProducts = sortProductsByPriceDesc(records); // Sort before rendering

      return (
        <div>
          {sortedProducts.map((product) => (
            <ProductCard name={product.name} filter={filter} price={product.price} description={product.description} imgsrc={product.img} brand={product.name} stars={product.stars}/> // Spread product data to ProductCard
          ))}
        </div>
      );
    }

    else if(sort=="star-asc"){
      const sortedProducts = sortProductsByStarAsc(records); // Sort before rendering

    return (
      <div>
        {sortedProducts.map((product) => (
          <ProductCard name={product.name} filter={filter} price={product.price} description={product.description} imgsrc={product.img} brand={product.name} stars={product.stars}/> // Spread product data to ProductCard
        ))}
      </div>
    );
  }

  else if(sort=="star-desc"){
    const sortedProducts = sortProductsByStarDesc(records); // Sort before rendering

  return (
    <div>
      {sortedProducts.map((product) => (
        <ProductCard name={product.name} filter={filter} {...product} imgsrc={product.img} brand={product.name} stars={product.stars}/> // Spread product data to ProductCard
      ))}
    </div>
  );
  }

  else{
      return (
      <div>
         {records.map((product) => ( 
          <ProductCard key={product._id} name={product.name} filter={filter} {...product} imgsrc={product.img} brand={product.name} stars={product.stars}/> // Spread product data to ProductCard
        ))}
      </div>
    );
  }


    function sortProductsByPriceAsc(products) {
        return products.sort((productA, productB) => {
          const priceA = parseFloat(productA.price); // Extract numerical price from "RM100" format
          const priceB = parseFloat(productB.price);
          return priceA - priceB; // Ascending order (lowest to highest)
        });
      }

      function sortProductsByPriceDesc(products) {
        return products.sort((productA, productB) => {
          const priceA = parseFloat(productA.price); // Extract numerical price from "RM100" format
          const priceB = parseFloat(productB.price);
          return priceB - priceA; // Descending order (highest to lowest)
        });
      }

      function sortProductsByStarAsc(products) {
        return products.sort((productA, productB) => {
          const starA = productA.stars;
          const starB = productB.stars;
          return starA - starB; // Ascending order (lowest to highest)
        });
      }

      function sortProductsByStarDesc(products) {
        return products.sort((productA, productB) => {
          const starA = productA.stars;
          const starB = productB.stars;
          return starB - starA; // Descending order (highest to lowest)
        });
      }
}


export default ProductList