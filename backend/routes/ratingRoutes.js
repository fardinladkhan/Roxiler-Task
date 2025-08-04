// backend/routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controller/ratingController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Get all stores with avg rating and user’s submitted rating
router.get('/', verifyToken, requireRole('normal_user'), ratingController.getAllStores);

// Submit or update rating
router.post('/', verifyToken, requireRole('normal_user'), ratingController.submitRating);

module.exports = router;
