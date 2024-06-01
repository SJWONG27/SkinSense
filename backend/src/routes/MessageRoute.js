const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const UserMessage = require('../models/UserMessageModel');
const jwt = require("jsonwebtoken");
require("dotenv").config();

// GET messages for a specific user
router.get('/:user/messages', async (req, res) => {
    const user = req.params.user;
    const currentUser = req.query.currentUser;
    try {

        const sentMessages = await UserMessage.find({ senderName: currentUser, receiverName: user });
        const receivedMessages = await UserMessage.find({ senderName: user, receiverName: currentUser });

        // Combine sent and received messages into a single array
        const allMessages = [...sentMessages, ...receivedMessages]
            .flatMap(message => message.messages.map(msg => ({ ...msg.toObject(), senderName: message.senderName })));

        // Sort messages by timestamp and ObjectId to handle messages with the same timestamp
        allMessages.sort((a, b) => {
            const timeDiff = new Date(a.timestamp) - new Date(b.timestamp);
            if (timeDiff === 0) {
                // If timestamps are equal, sort by ObjectId
                return a._id.getTimestamp() - b._id.getTimestamp();
            }
            return timeDiff;
        });

        res.json(allMessages);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST a new message
router.post('/newMessage', async (req, res) => {
    const { senderName, receiverName, ...messageData } = req.body;
    const message = new UserMessage({
        senderName,
        receiverName,
        messages: [messageData]
    });

    try {
        const newMessage = await message.save();
        const lastMessage = newMessage.messages[newMessage.messages.length - 1];
        const simplifiedMessage = {
            senderName,
            content: lastMessage.content,
            timestamp: lastMessage.timestamp,
            file: lastMessage.file
        };

        res.status(201).json(simplifiedMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Other CRUD operations can be added similarly

// GET all user names
// router.get('/userName', async (req, res) => {
//     try {
//         const users = await User.find({}, 'username');
//         // const users = await Product.find({});
//         res.json(users)
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

router.get('/userName', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        jwt.verify(token, `${process.env.TOKEN_KEY}`, async (err, data) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const userId = data.id;
            const users = await User.find({ _id: { $ne: userId } }, 'username');
            res.json(users);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/currentUser', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        jwt.verify(token, `${process.env.TOKEN_KEY}`, async (err, data) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const userId = data.id;
            const user = await User.findById(userId, 'username');
            res.json(user.username);
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
