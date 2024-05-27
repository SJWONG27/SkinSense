const User = require('../models/UserModel');
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.json({message:'Incorrect password or email' }) 
    }
     const token = createSecretToken(user._id);
     res.cookie("token", token, {
       withCredentials: true,
       httpOnly: false,
     });
     res.status(201).json({ message: "User logged in successfully", success: true });
     next()
  } catch (error) {
    console.error(error);
  }
}

module.exports.updateProfile = async (req, res) => {
  try {
      const { email, username, phoneNumber, gender, dateOfBirth, profilePic } = req.body;
      const userId = req.userId; // Assume userId is set in userVerification middleware
      const updatedData = { email, username, phoneNumber, gender, dateOfBirth, profilePic };

      const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};


