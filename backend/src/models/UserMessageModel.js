const mongoose = require('mongoose');

const userMessageSchema = new mongoose.Schema({
    senderName:{
        type: String
    },
    receiverName:{
        type: String
    },
    messages: [
        {
            content: String,
            file: String,
            fileType: String,
            timestamp: String 
        }
    ],
    createdAt:{
        type: Date,
        default: new Date(),
    }
});

module.exports = mongoose.model("UserMessage", userMessageSchema);