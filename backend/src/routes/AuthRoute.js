const { Signup, Login, updateProfile  } = require('../controllers/AuthController')
const { userVerification } = require('../middleware/AuthMiddleware')
const router = require('express').Router()

router.post('/',userVerification)
router.post('/signup', Signup)
router.post('/login', Login)
router.put('/profile', userVerification, updateProfile); 

module.exports = router