const User = require("../models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Received token:', token); // Log received token

  if (!token) {
    console.log("Token not found in cookies");
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }
  jwt.verify(token, `${process.env.TOKEN_KEY}`, async (err, data) => {
    if (err) {
      console.log("Token verification failed", err);
      return res.status(401).json({ status: false, message: "Unauthorized" });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        console.log("User verified:", user);
        req.userId = user._id; 
        req.user = user; 
        next(); 
      } else {
        console.log("User not found");
        return res.status(404).json({ status: false, message: "User not found" });
      }
    }
  });
};
