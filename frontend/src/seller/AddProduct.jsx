import React from 'react'
import { useState, useEffect } from 'react';


function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const [sellerName, setSellerName] = useState("");
  // to get the username, as known as seller name of the product
  useEffect(()=>{ 
    async function getUsername() {
      const email = JSON.parse(localStorage.getItem('email'));
      console.log(email)
      const response = await fetch(`http://localhost:4000/user/${email}`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const result = await response.json();
      setSellerName(result.username);
  }
  getUsername();
  return;
}, [])
  

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile); // Match backend field name
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('quantity', quantity);
      formData.append('sellername', sellerName);

      const response = await fetch('http://localhost:4000/image/upload', {
        method:"POST",
        body: formData
      });

    } catch (error) {
      console.error('Upload error:', error);
    }
  };


  return (
    <div className='AddProduct'>
      <div className='pagetitle'><h2>Add Product</h2></div>
      
      <form onSubmit={handleSubmit}>
      <div className='form'>
        <div className='form-input'>
          <label>
            Product Name:
            <input 
              type='text'
              required
              value={name}
              onChange={(e)=>{setName(e.target.value)}}
            />
          </label>
        </div>
        <div className='form-input'>
          <label>
            Product Description:
            <textarea required  value={description}
              onChange={(e)=>{setDescription(e.target.value)}}
            
            />
          </label>
        </div>
        <div className='form-input'>
          <label>
            Product Price:
            <input required  value={price}
              onChange={(e)=>{setPrice(e.target.value)}}
              type='number'
            />
          </label>
        </div>
        <div className='form-input'>
          <label>
            Product Quantity:
            <input required  value={quantity}
              onChange={(e)=>{setQuantity(e.target.value)}}
              type='number'
            />
          </label>
        </div>
        <div className='form-input'>
          <label>
            Product Image:
            <input onChange={handleFileChange} name='avatar' required
              type='file'
              accept='image'
            />
          </label>
        </div>
        <div className='containerbtn'>
          <button id='btnAddProduct'>Add Product</button>
          <button id='btnCancel'>Cancel</button>
        </div>
      </div>
      </form>

    </div>
  )
}

export default AddProduct