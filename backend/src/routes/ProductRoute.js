const express = require("express");
const router = express.Router();
const Product = require('../models/ProductModel');

// This section will help you get a list of all the products.
router.get("/", async (req, res) => {
  const results = await Product.find({});
  res.send(results).status(200);
});

module.exports = router;