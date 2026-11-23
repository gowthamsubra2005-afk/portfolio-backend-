const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'gowthamsubra31@gmail.com').trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail !== adminEmail) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    let passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!passwordHash && process.env.ADMIN_PASSWORD) {
      passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    }

    if (!passwordHash) {
      return res.status(500).json({
        success: false,
        message: 'Admin authentication is not configured in environment variables.',
      });
    }

    const isMatch = await bcrypt.compare(password, passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    const token = jwt.sign(
      { email: adminEmail, role: 'admin' },
      process.env.JWT_SECRET || 'gowtham_portfolio_default_jwt_secret',
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      admin: {
        email: adminEmail,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
    });
  }
};

// @desc    Verify admin token
// @route   GET /api/auth/verify
// @access  Private / Admin
const verifyToken = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Token is valid.',
    admin: req.admin,
  });
};

module.exports = { adminLogin, verifyToken };
