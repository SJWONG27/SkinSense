import React, { useEffect, useState } from 'react';
import "../styles/index.css";

const MyProduct = () => {
  const [products, setProducts] = useState([]);
  const getImgUrl = (imgPath) => {
    if (imgPath.startsWith('blob:')) {
      return imgPath;
    }
    const adjustedPath = imgPath.replace('/frontend/src/uploads/', '/src/uploads/');
    return `/${adjustedPath}`;
  };

  useEffect(() => {
    fetch("http://localhost:4000/product/myproducts/", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setProducts(data);
    })
    .catch(error => console.error('Error fetching user products:', error));
  }, []);

  const handleToggleEdit = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        return { 
          ...product, 
          isEditing: !product.isEditing, 
          editedData: product.editedData || {} 
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleModifyProduct = (productId, field, value) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        let newEditedData = { ...product.editedData, [field]: value };
        return { ...product, editedData: newEditedData };
      }
      return product;
    });
    setProducts(updatedProducts);
  };
  

  const handleSaveChanges = (productId) => {
    const productToUpdate = products.find((product) => product._id === productId);
    const updatedData = productToUpdate.editedData;
  
    fetch(`http://localhost:4000/product/${productId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
    .then(response => {
      if (!response.ok) {
        console.error('Failed to update product:', response.status, response.statusText);
        return;
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        const updatedProducts = products.map((product) => {
          if (product._id === productId) {
            return {
              ...product,
              ...data,
              isEditing: false,
              editedData: {},
            };
          }
          return product;
        });
        setProducts(updatedProducts);
      } else {
        console.error('Error updating product: No data returned');
      }
    })
    .catch(error => console.error('Error updating product:', error));
  };
  

  const handleCancelChanges = (productId) => {
    const updatedProducts = products.map((product) => {
      if (product._id === productId) {
        return { ...product, isEditing: false, editedData: {} };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleDeleteProduct = (productId) => {
    fetch(`http://localhost:4000/product/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response.ok) {
        const updatedProducts = products.filter((product) => product._id !== productId);
        setProducts(updatedProducts);
        console.log("Product deleted successfully");
      } else {
        console.error('Error deleting product');
      }
    })
    .catch(error => console.error('Error deleting product:', error));
  };

  return (
    <div className='MyProduct'>
      <div className='pagetitle'><h2>My Products</h2></div>
      {products.map((product) => (
        <div key={product._id} className="product">
          <div className='product-image'>
            <img src={getImgUrl(product.img)} alt={product.name} />
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
                    New Name:
                    <input
                      type="text"
                      value={product.editedData?.name || ''}
                      onChange={(e) => handleModifyProduct(product._id, 'name', e.target.value)}
                    />
                  </label>
                </div>
                <div className='form-input'>
                  <label>
                    New Price:
                    <input
                      type="number"
                      value={product.editedData?.price || ''}
                      onChange={(e) => handleModifyProduct(product._id, 'price', parseInt(e.target.value))}
                    />
                  </label>
                </div>
                <div className='form-input'>
                  <label>
                    New Description:
                    <textarea
                      value={product.editedData?.description || ''}
                      onChange={(e) => handleModifyProduct(product._id, 'description', e.target.value)}
                    />
                  </label>
                </div>
                <div className='form-input'>
                  <label>
                    New Quantity:
                    <input
                      type="number"
                      value={product.editedData?.quantity || ''}
                      onChange={(e) => handleModifyProduct(product._id, 'quantity', parseInt(e.target.value))}
                    />
                  </label>
                </div>
                <button onClick={() => handleSaveChanges(product._id)}>Save</button>
                <button onClick={() => handleCancelChanges(product._id)}>Cancel</button>
              </div>
            ) : (
              <div>
                <button onClick={() => handleToggleEdit(product._id)}>Modify</button>
                <button id='btnDelete' onClick={() => handleDeleteProduct(product._id)}>Delete</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyProduct;
