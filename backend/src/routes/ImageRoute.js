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

  router.post("/uploadProfilePic", upload.single("profilePic"), async (req, res) => {
    const userId = req.body.userId;
    const profilePicPath = req.file.path.replace(/\\/g, "/"); // Convert to forward slashes
  
    try {
      const user = await User.findByIdAndUpdate(userId, { profilePic: profilePicPath }, { new: true });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: 'Profile picture updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  module.exports = router;


