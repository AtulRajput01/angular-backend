const express = require('express');
const { signup, login, registerAdmin, sendEmail, verifyOTP, resetPassword, logout } = require('../controllers/authController')
const router = express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.post('/register-admin', registerAdmin);
router.post('/send-email',sendEmail)
router.post('/verify-otp', verifyOTP);
router.post('/resetPassword', resetPassword);
router.post('/logout', logout);

module.exports = router;