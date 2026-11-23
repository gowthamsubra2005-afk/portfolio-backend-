const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
} = require('../controllers/contactController');
const { protectAdmin } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

// Public inquiry submission endpoint with rate limiting
router.post('/', contactLimiter, submitMessage);

// Protected administrative management endpoints
router.get('/', protectAdmin, getMessages);
router.get('/:id', protectAdmin, getMessageById);
router.patch('/:id/status', protectAdmin, updateMessageStatus);
router.delete('/:id', protectAdmin, deleteMessage);

module.exports = router;
