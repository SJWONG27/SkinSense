const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Your email is required"],
        unique: true,
    },
    username:{
        type: String,
        required: [true, "Your username is required"]
    },
    password:{
        type: String,
        required: [true, "Your password is required"]
    },
    createdAt:{
        type: Date,
        default: new Date(),
    },
    phoneNumber:{
        type: String,
    },
    dateOfBirth:{
        type: Date,
    },
    gender:{
        type: String,
    },
    profilePic:{
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

module.exports = mongoose.model("User", userSchema);