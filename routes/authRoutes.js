const express = require('express');
const router = express.Router();
const { adminLogin, verifyToken } = require('../controllers/authController');
const { protectAdmin } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

// Admin login endpoint
router.post('/login', loginLimiter, adminLogin);

// Verify admin session token
router.get('/verify', protectAdmin, verifyToken);

module.exports = router;
