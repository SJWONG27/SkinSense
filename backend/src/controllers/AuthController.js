const User = require('../models/UserModel');
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const nodemailer = require('nodemailer');

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
      return res.json({message:'Invalid account' }) 
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
    const { email, username, phoneNumber, gender, dateOfBirth } = req.body;
    const userId = req.userId; // Get userId from middleware
    const updatedData = { email, username, phoneNumber, gender, dateOfBirth };

    if (req.file) {
      updatedData.profilePic = req.file.path.replace(/\\/g, "/"); 
    }
    delete updatedData.password;
    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('Profile updated successfully:', user);
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    console.log('Received request to reset password for email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User with this email does not exist.');
      return res.status(400).send('User with this email does not exist.');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    console.log('Generated reset token for user:', user);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: false,
      auth: {
        user: 'lawmeow743@gmail.com',
        pass: 'spsb oihq osun pgzw'
      }
    });

    const mailOptions = {
      to: user.email,
      from: 'lawmeow743@gmail.com', 
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n` +
            `http://${req.headers.host}/reset-password/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).send('Error sending email.');
      } else {
        console.log('Recovery email sent:', response);
        res.status(200).send('Recovery email sent.');
      }
    });
  } catch (error) {
    console.error('Error in forgot password route:', error);
    res.status(500).send('Error in forgot password route');
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    console.log(`Received token: ${token}`);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('Token is invalid or has expired.');
      return res.status(400).send('Password reset token is invalid or has expired.');
    }

    user.password = req.body.password; // Assign new password directly
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send('Password has been updated.');
  } catch (error) {
    console.error('Error in reset password route:', error);
    res.status(500).send('Error in reset password route');
  }
};
