// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Register (Normal User or Store Owner)
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get logged-in user data
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
