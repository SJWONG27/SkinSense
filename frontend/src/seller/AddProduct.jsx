import React from 'react'
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function AddProduct() {

  const [addSnackbar, setAddSnackbar] = useState(false);

  const handleAddSnackbarClose = () => {
    setAddSnackbar(false);
  };


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sellerID, setSellerID] = useState("");

  // to get the user ID, to trace seller name of product
  useEffect(()=>{ 
    async function getUserID() {
      const id = JSON.parse(localStorage.getItem('id'));
      setSellerID(id);
  }
  getUserID();
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
      formData.append('sellerID', sellerID);

      const response = await fetch('http://localhost:4000/image/upload', {
        method:"POST",
        body: formData
      });

      setAddSnackbar(true)

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

      <Snackbar
        open={addSnackbar}
        anchorOrigin={{ vertical:"bottom", horizontal:"right" }}
        autoHideDuration={1500}
        onClose={handleAddSnackbarClose}>
          <Alert
            severity="success"
            variant="filled"
            >
            Successfully added product
          </Alert>
        </Snackbar>

    </div>
  )
}

export default AddProduct