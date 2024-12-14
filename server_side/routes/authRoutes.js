const express = require('express');
const {
    register,
    login,
    logout,
    resetPassword
} = require('../controllers/authController');
const authenticate = require('../middlewares/authMiddleware'); // Import the middleware

const router = express.Router();

// Public Routes (No Authentication Required)
router.post('/register', register); // Register a New Account
router.post('/login', login);       // User Login

// Protected Routes (Require Authentication)
router.post('/logout', authenticate, logout); // User Logout
router.post('/reset-password', authenticate, resetPassword); // Reset Password

module.exports = router;


