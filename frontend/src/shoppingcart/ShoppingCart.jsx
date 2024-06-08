import React, { useState, useEffect, useContext } from 'react';
import './cart.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../general/UserContext';


const ShoppingCart = () => {
  // State to store products and their quantities
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  // const userId = '6662b8ba8f55477ed2e6c24a';

  const userId = localStorage.getItem('userId');
  const id = JSON.parse(localStorage.getItem('id')); // this line works with line const url = `http://localhost:4000/cart/${id}`;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (!userId) return; // Exit early if userId is not available
        if (typeof userId !== 'string') throw new Error('Not string');
        const userIdWithoutQuotes = userId.replace(/"/g, ''); 
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
  const updateItemQuantity = (productId, newQuantity) => {

    updateCartQuantityFunc(productId, newQuantity);

    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, quantity: newQuantity } : product
      )
    );     
  };

  // Function to remove a product from the cart
  const removeProduct = (productId) => {

    deleteFromCartFunc(productId);

    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  // Function to calculate total price of items in the cart
  const calculateTotalPrice = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };
  
  const handleCheckout = async () => {
    const subtotal = calculateTotalPrice();
    const cartItems = products.filter(product => product.quantity > 0);

    const orderData = {
      userId,
      items: cartItems,
      total: subtotal,
    };

    try{
      const response = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      console.log('Order created:', result);

      navigate('/transaction/checkout', { state: { subtotal, cartItems } });
    } catch(err){
      console.error('Error creating order: ', err)
    }

    
  };

  const updateCartQuantityFunc = async (productId, newQuantity) => {
    const response = await fetch(`http://localhost:4000/cart/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        itemId: productId,
        quantity: newQuantity
      })
    });

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }

  };

  const deleteFromCartFunc = async (productId) => {
    const response = await fetch(`http://localhost:4000/cart/remove`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
        itemId: productId
      })
    });

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      console.error(message);
      return;
    }

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
