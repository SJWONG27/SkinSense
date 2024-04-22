import React from 'react'

function AddProduct() {
  return (
    <div className='AddProduct'>
      <div className='pagetitle'><h2>Add Product</h2></div>
      
      <div className='form'>
        <div className='form-input'>
          <label>
            Product Name:
            <input
              type='text'
            />
          </label>
        </div>
        <div className='form-input'>
          <label>
            Product Description:
            <textarea
            
            />
          </label>
        </div>
        <div className='form-input'>
          <label>
            Product Price:
            <input
              type='number'
            />
          </label>
        </div>
        <div className='form-input'>
          <label>
            Product Quantity:
            <input
              type='number'
            />
          </label>
        </div>
        <div className='form-input'>
          <label>
            Product Image:
            <input
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

    </div>
  )
}

export default AddProduct