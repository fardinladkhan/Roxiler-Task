// backend/routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const storeController = require('../controller/storeController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Store Owner: Add new store
router.post('/add', verifyToken, requireRole('store_owner'), storeController.createStore);

// Store Owner: View their stores and ratings
router.get('/my-stores', verifyToken, requireRole('store_owner'), storeController.getStoreRatings);

module.exports = router;
