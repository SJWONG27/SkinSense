const express = require("express");
const router = express.Router();
const User = require('../models/UserModel');
const { userVerification } = require('../middleware/AuthMiddleware');
const multer = require('multer'); 

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/src/uploads'); 
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage2 });

router.put("/:userId", userVerification, upload.single('profilePic'), async (req, res) => {
  const { userId } = req.params;
  const { username, email, phoneNumber, gender, dateOfBirth } = req.body;
  const profilePic = req.file?.path.replace(/\\/g, "/"); // Convert to forward slashes

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
