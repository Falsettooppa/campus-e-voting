const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const crypto = require('crypto');

const router = express.Router();

/*
========================================
REGISTER
========================================
*/
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: 'Full name, email and password are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists.'
      });
    }

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password
    });

    return res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email already registered.'
      });
    }

    return res.status(500).json({
      message: error.message || 'Server error during registration.'
    });
  }
});


/*
========================================
LOGIN
========================================
*/
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password.'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined.');
      return res.status(500).json({
        message: 'Server configuration error.'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({ token });

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      message: error.message || 'Server error during login.'
    });
  }
});
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Return same response even if user doesn't exist (prevents email enumeration)
    if (!user) {
      return res.status(200).json({
        message: 'If the email exists, a reset link has been generated.'
      });
    }

    const token = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // ✅ For project/demo: return token. In production send via email/SMS.
    return res.status(200).json({
      message: 'Password reset token generated.',
      resetToken: token
    });
  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: 'New password is required.' });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    user.password = password; // ✅ bcrypt pre-save hook will hash it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/*
========================================
GET CURRENT USER
========================================
*/
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found.'
      });
    }

    return res.status(200).json(user);

  } catch (error) {
    console.error('ME ROUTE ERROR:', error);

    return res.status(500).json({
      message: error.message || 'Server error.'
    });
  }
});


module.exports = router;
