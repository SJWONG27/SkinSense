import React, { useState, useEffect, useContext } from 'react';
import product1 from '../assets/images/img_product1.jpeg';
import product2 from '../assets/images/img_product2.jpg';
import './cart.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../general/UserContext';


const ShoppingCart = () => {
  // State to store products and their quantities
  const navigate = useNavigate();

/*   const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', price: 10, quantity: 0, image: product1 },
    { id: 2, name: 'Product 2', price: 20, quantity: 0, image: product2 },
    { id: 3, name: 'Product 3', price: 15, quantity: 0, image: product1 },
  ]); */

  const [products, setProducts] = useState([]);
  // const userId = '6662b8ba8f55477ed2e6c24a';

  const userId = localStorage.getItem('userId');
  const id = JSON.parse(localStorage.getItem('id')); // this line works with line const url = `http://localhost:4000/cart/${id}`;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (!userId) return; // Exit early if userId is not available
        if (typeof userId !== 'string') throw new Error('Not string');
        const userIdWithoutQuotes = userId.replace(/"/g, ''); // ma de ji bai bcuz of this line of code take me half of my day
        const url = `http://localhost:4000/cart/${userIdWithoutQuotes}`;
        //const url = `http://localhost:4000/cart/${id}`;
        console.log(url)

        const response = await fetch(url);
        // const response = await fetch('http://localhost:4000/cart/6662b8ba8f55477ed2e6c24a');
        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    fetchCartData();
  }, [userId]);

  // Function to update quantity of a product
  const updateItemQuantity = (id, newQuantity) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  // Function to remove a product from the cart
  const removeProduct = (id) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  // Function to calculate total price of items in the cart
  const calculateTotalPrice = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };
  const handleCheckout = () => {
    const subtotal = calculateTotalPrice();
    const cartItems = products.filter(product => product.quantity > 0);
    navigate('/transaction/checkout', { state: { subtotal, cartItems } });
  };


  return (
    <div className='homeContainer'>
      <div className='cart'>
          {products.map((product) => (
            <div className='productCartContainer' key={product.id}>
              
              <img src={product.image.replace('../frontend/', '')} alt={product.name} style={{ width: '100px', height: '100px' }} />
              <div className='productCartContainer2'>
                {product.name} - ${product.price} 
                <label>
                  Quantity:
                  <input 
                    type="number" 
                    value={product.quantity} 
                    onChange={(e) => updateItemQuantity(product.id, parseInt(e.target.value))} 
                    min="0" 
                  />
                </label>
                
                <button onClick={() => removeProduct(product.id)}>Remove</button>
              </div>             
            </div>
          ))}

      <p>Total: RM{calculateTotalPrice()}</p>
      <button onClick={handleCheckout}>Checkout</button>
      </div>
    </div>
  );
};

export default ShoppingCart;
