
const express = require("express");
const router = express.Router();
const User = require('../models/UserModel');

// This help convert the id from string to ObjectId for the _id.
const { ObjectId } = require('mongodb');




// For first time login before changing email at profile
// This section will help you get user detail by email.
router.get("/:email", async (req, res) => {
  const results = await User.findOne({email:req.params.email});
  res.send(results).status(200);
});

// After email changed at profile, we lock onto the User ID
// This section will help you get user detail by user ID.
router.get("/userID/:id", async (req, res) => {
  console.log(req.params.id)
  const results = await User.findById(req.params.id);
  res.send(results).status(200);
});



module.exports = router;
