const express = require("express");
const router = express.Router();
const User = require('../models/UserModel');
// This help convert the id from string to ObjectId for the _id.
const { ObjectId } = require('mongodb');

// This section will help you get user detail by email.
router.get("/:email", async (req, res) => {
  const results = await User.findOne({email:req.params.email});
  res.send(results).status(200);
});


module.exports = router;
