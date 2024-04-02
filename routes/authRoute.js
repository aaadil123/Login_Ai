const express = require("express");
const router = express.Router();
const cors = require("cors");
const {test, register, login, getProfile} = require('../controllers/authController')

// middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000'
    })
)

// router.get('/', test)
router.post('/signup', register)
router.post('/login', login)
router.get('/profile', getProfile)

module.exports = router;