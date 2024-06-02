import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard'; 
import './product.css';

function ProductList({filter, sort}){

  // get the _id correspond to the logged-in email and store in local storage, to persist across email changes
  useEffect(()=>{ 
    async function getUserID() {
      const email = JSON.parse(localStorage.getItem('email'));
      const response = await fetch(`http://localhost:4000/user/${email}`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const result = await response.json();
      localStorage.setItem("id", JSON.stringify(result._id))    // store the currently logged-in user ID 
    }
    getUserID();
    return;
  }, [])

  
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

      for (var product of records){
        var userID = product.sellerID;
        const response = await fetch(`http://localhost:4000/user/userID/${userID}`);
        const result = await response.json();
        product.sellername = result.username
     }

     setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);


    if(sort=="price-asc"){
        const sortedProducts = sortProductsByPriceAsc(records); // Sort before rendering

      return (
        <div>
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} index={product._id.toString()} name={product.name} filter={filter} price={product.price} description={product.description} imgsrc={product.img} seller={product.sellername} stars={product.stars}/> // Spread product data to ProductCard
          ))}
        </div>
      );
    }

    else if(sort=="price-desc"){
        const sortedProducts = sortProductsByPriceDesc(records); // Sort before rendering

      return (
        <div>
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} index={product._id.toString()} name={product.name} filter={filter} price={product.price} description={product.description} imgsrc={product.img} seller={product.sellername} stars={product.stars}/> // Spread product data to ProductCard
          ))}
        </div>
      );
    }

    else if(sort=="star-asc"){
      const sortedProducts = sortProductsByStarAsc(records); // Sort before rendering

    return (
      <div>
        {sortedProducts.map((product) => (
          <ProductCard key={product._id} index={product._id.toString()} name={product.name} filter={filter} price={product.price} description={product.description} imgsrc={product.img} seller={product.sellername} stars={product.stars}/> // Spread product data to ProductCard
        ))}
      </div>
    );
  }

  else if(sort=="star-desc"){
    const sortedProducts = sortProductsByStarDesc(records); // Sort before rendering

  return (
    <div>
      {sortedProducts.map((product) => (
        <ProductCard key={product._id} index={product._id.toString()} name={product.name} filter={filter} {...product} imgsrc={product.img} seller={product.sellername} stars={product.stars}/> // Spread product data to ProductCard
      ))}
    </div>
  );
  }

  else{
      return (
      <div>
         {records.map((product) =>(
            <ProductCard key={product._id} index={product._id.toString()} name={product.name} filter={filter} {...product} imgsrc={product.img} seller={product.sellername} stars={product.stars}/> // Spread product data to ProductCard
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