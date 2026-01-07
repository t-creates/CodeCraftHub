const express = require('express');
const { register, login, getProfile } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

// User registration route
router.post('/register', register);

// User login route
router.post('/login', login);

// Get user profile route (protected)
router.get('/profile', authenticate, getProfile);

module.exports = router;