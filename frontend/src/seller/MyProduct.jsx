import React, { useState } from 'react';
import img_product1 from '../assets/images/img_product1.jpeg'
import img_product2 from '../assets/images/img_product2.jpg'
//import '../App.css'
import "../styles/index.css"


const MyProduct = () => {
  // Sample product data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Product 1',
      image: img_product1,
      price: 20,
      description: 'Description of Product 1',
      quantity: 10,
      isEditing: false, // Flag to track if product is in edit mode
      editedData: {}, // Data edited by the seller
    },
    {
      id: 2,
      name: 'Product 2',
      image: img_product2,
      price: 30,
      description: 'Description of Product 2',
      quantity: 15,
      isEditing: false,
      editedData: {},
    },
    // Add more products as needed
    {
      id: 3,
      name: 'Product 2',
      image: img_product2,
      price: 30,
      description: 'Description of Product 2',
      quantity: 15,
      isEditing: false,
      editedData: {},
    },
    {
      id: 4,
      name: 'Product 2',
      image: img_product2,
      price: 30,
      description: 'Description of Product 2',
      quantity: 15,
      isEditing: false,
      editedData: {},
    },
  ]);

  // Function to handle toggling edit mode for a product
  const handleToggleEdit = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, isEditing: !product.isEditing };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  // Function to handle modifications to product details
  const handleModifyProduct = (productId, field, value) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        return { ...product, editedData: { ...product.editedData, [field]: value } };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  // Function to save modifications
  const handleSaveChanges = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        // Apply edited data and exit edit mode
        return {
          ...product,
          name: product.editedData.name || product.name,
          image: product.editedData.image || product.image,
          price: product.editedData.price || product.price,
          description: product.editedData.description || product.description,
          quantity: product.editedData.quantity || product.quantity,
          isEditing: false,
          editedData: {},
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  // Function to cancel modifications
  const handleCancelChanges = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        // Exit edit mode and discard edited data
        return { ...product, isEditing: false, editedData: {} };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  // Function to delete 
  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
  };

  return (
    <div className='MyProduct'>
      <div className='pagetitle'><h2>My Products</h2></div>
      {products.map((product) => (
        <div key={product.id} className="product">
          <div className='product-image'>
            <img src={product.image} alt={product.name} />
          </div>
          <div className='product-detail'>
            <h3>{product.name}</h3>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            {product.isEditing ? (
              <div>
                <div className='form-input'>
                  <label>
                    New Image:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleModifyProduct(product.id, 'image', URL.createObjectURL(e.target.files[0]))
                      }
                    />
                  </label>
                </div>
                <div className='form-input'>
                  <label>
                    New Name:
                    <input
                      type="text"
                      value={product.editedData.name === undefined ? '' : product.editedData.name}
                      onChange={(e) => handleModifyProduct(product.id, 'name', e.target.value)}
                    />
                  </label>
                </div>
                <div className='form-input'>
                  <label>
                    New Price:
                    <input
                      type="number"
                      value={product.editedData.price === undefined ? '' : product.editedData.price}
                      onChange={(e) => handleModifyProduct(product.id, 'price', parseInt(e.target.value))}
                    />
                  </label>
                </div>
                <div className='form-input'>
                  <label>
                    New Description:
                    <textarea
                      value={product.editedData.description === undefined ? '' : product.editedData.description}
                      onChange={(e) => handleModifyProduct(product.id, 'description', e.target.value)}
                    />
                  </label>
                </div>
                <div className='form-input'>
                  <label>
                    New Quantity:
                    <input
                      type="number"
                      value={product.editedData.quantity === undefined ? '' : product.editedData.quantity}
                      onChange={(e) => handleModifyProduct(product.id, 'quantity', parseInt(e.target.value))}
                    />
                  </label>
                </div>
                <button onClick={() => handleSaveChanges(product.id)}>Save</button>
                <button onClick={() => handleCancelChanges(product.id)}>Cancel</button>
              </div>
            ) : (
              <div>
                <button onClick={() => handleToggleEdit(product.id)}>Modify</button>
                <button id='btnDelete' onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyProduct;