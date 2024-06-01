const { Signup, Login, updateProfile  } = require('../controllers/AuthController')
const { userVerification } = require('../middleware/AuthMiddleware')
const router = require('express').Router()
const profileRoute = require('./ProfileRoute');


router.post('/', userVerification, (req, res) => {
    res.json({
      status: true,
      user: {
        username: req.user.username,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
        gender: req.user.gender,
        dateOfBirth: req.user.dateOfBirth,
        profilePic: req.user.profilePic,
        _id: req.user._id
      }
    });
  });
router.post('/signup', Signup)
router.post('/login', Login)
router.use('/profile', profileRoute);


module.exports = router
