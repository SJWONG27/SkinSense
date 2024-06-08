const express = require("express");
const router = express.Router();
const Product = require('../models/ProductModel');
const auth = require("../middleware/AuthMiddleware");
const { ObjectId } = require('mongodb');

// This section will help you get a list of all the products.
router.get("/", async (req, res) => {
  const results = await Product.find({});
  res.send(results).status(200);
});

router.patch("/:id",  async (req, res) => {
  try { 
    if (req.body.star !== undefined) {
      // Update stars
      const updates = { $set: { stars: req.body.star } };
      const result = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
      res.status(200).json(result);
    } else {
      // Update product details
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (updatedProduct) {
        res.status(200).json(updatedProduct);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product' });
  }
});



// This section will help you get a list of all the comments of a product.
router.get("/comments/:id", async (req, res) => {
  const results = await Product.findById(req.params.id, 'comments');
  res.send(results).status(200);
});


// This section will help you update a product by adding a comment.
router.patch("/comments/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const updates = 
      {$push:
        {"comments":
            {   
                userID: req.body.userID,
                star: Number(req.body.star),
                content: req.body.content,
                date: new Date(Date.now()),
                username: ""
            }
        }
      };
      const result = await Product.findByIdAndUpdate(query, updates)
      res.send(result).status(200);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating record");
    }
  });

  router.get("/myproducts", auth.userVerification, async(req, res) => {
    try{
      const results = await Product.find({sellerID: req.user._id});
      res.status(200).send(results);
    } catch(err){
      console.error(err);
      res.status(500).send("Error fetching products for user")
    }
  });

  router.delete('/:id', auth.userVerification, async (req, res) => {
    try {
      const result = await Product.findByIdAndDelete(req.params.id);
      if (result) {
        res.status(200).json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error deleting product' });
    }
  });  

module.exports = router;  