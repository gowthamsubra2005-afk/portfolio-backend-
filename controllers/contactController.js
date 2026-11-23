const ContactMessage = require('../models/ContactMessage');
const validator = require('validator');
const mongoose = require('mongoose');

// @desc    Submit a new contact message
// @route   POST /api/contact
// @access  Public
const submitMessage = async (req, res) => {
  try {
    let { fullName, email, subject, message } = req.body;

    // Server-side validation
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields (fullName, email, subject, message) are required.',
      });
    }

    // Sanitize input
    fullName = validator.escape(fullName.trim());
    subject = validator.escape(subject.trim());
    message = validator.escape(message.trim());
    email = email.trim().toLowerCase();

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (fullName.length < 2 || fullName.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 100 characters.',
      });
    }

    if (subject.length < 3 || subject.length > 150) {
      return res.status(400).json({
        success: false,
        message: 'Subject must be between 3 and 150 characters.',
      });
    }

    if (message.length < 10 || message.length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 3000 characters.',
      });
    }

    // Save message to MongoDB Atlas
    const savedMessage = await ContactMessage.create({
      fullName,
      email,
      subject,
      message,
      isRead: false,
      submittedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: {
        id: savedMessage._id,
        fullName: savedMessage.fullName,
        email: savedMessage.email,
        subject: savedMessage.subject,
        submittedAt: savedMessage.submittedAt,
      },
    });
  } catch (error) {
    console.error('Submit contact message error:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred while sending your message.',
    });
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
// @access  Private / Admin
const getMessages = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status === 'read') {
      query.isRead = true;
    } else if (status === 'unread') {
      query.isRead = false;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ fullName: regex }, { email: regex }, { subject: regex }];
    }

    const messages = await ContactMessage.find(query).sort({ submittedAt: -1 });

    const total = await ContactMessage.countDocuments();
    const unread = await ContactMessage.countDocuments({ isRead: false });
    const read = await ContactMessage.countDocuments({ isRead: true });

    return res.status(200).json({
      success: true,
      count: messages.length,
      stats: { total, unread, read },
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages.',
    });
  }
};

// @desc    Get message by ID (Admin only)
// @route   GET /api/contact/:id
// @access  Private / Admin
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid message ID.' });
    }

    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error('Get message by ID error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving message.' });
  }
};

// @desc    Update message read status (Admin only)
// @route   PATCH /api/contact/:id/status
// @access  Private / Admin
const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    if (typeof isRead !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isRead must be a boolean value.' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid message ID.' });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Update message status error:', error);
    return res.status(500).json({ success: false, message: 'Error updating message status.' });
  }
};

// @desc    Delete message (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private / Admin
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid message ID.' });
    }

    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }

    return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting message.' });
  }
};

module.exports = {
  submitMessage,
  getMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
};
