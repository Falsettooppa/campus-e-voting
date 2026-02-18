const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure your User model exists

const authMiddleware = async (req, res, next) => {
  // Get token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user from DB (without password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
