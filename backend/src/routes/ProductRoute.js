const express = require("express");
const router = express.Router();
const Product = require('../models/ProductModel');
// This help convert the id from string to ObjectId for the _id.
const { ObjectId } = require('mongodb');

// This section will help you get a list of all the products.
router.get("/", async (req, res) => {
  const results = await Product.find({});
  res.send(results).status(200);
});

// This section update Product stars based on comments
router.patch("/:id", async (req, res)=>{
  try{
    const updates = {$set: {stars:req.body.star}}
    const results = await Product.findByIdAndUpdate(req.params.id, updates)
    res.send(results).status(200);
  }
  catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
})



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

module.exports = router;