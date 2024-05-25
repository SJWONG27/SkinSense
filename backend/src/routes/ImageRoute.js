const express = require("express");
const router = express.Router();
const Product = require('../models/ProductModel');
const multer = require("multer")

// Create a storage object with a given configuration
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, '../frontend/src/uploads')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

// Set multer storage engine to the newly created object
const upload = multer({ storage: storage2})

// use Product model
router.post("/upload", upload.single("avatar"), async (req, res) => {

      const imagePath = req.file.path; // Get the path from Multer
      const actualPath = imagePath.replace(/\\/g, "/");  // change the backslash path (default Multer path) to forward slash
      
      const product = new Product({name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        img: actualPath})
      
      await product.save()
      res.json({ message: 'New image added to the db!' });
  });

  module.exports = router;


