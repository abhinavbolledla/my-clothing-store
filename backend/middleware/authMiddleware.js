const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect – Middleware to verify JWT token and attach the logged-in user to req.user.
 * Usage: Add as middleware to any route that requires authentication.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token part after "Bearer "
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (exclude password field)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found — token invalid' });
      }

      next();
    } catch (error) {
      console.error('JWT verify error:', error.message);
      return res.status(401).json({ message: 'Not authorized — invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }
};

/**
 * admin – Middleware to restrict access to admin users only.
 * Must be used AFTER the protect middleware.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied — Admins only' });
  }
};

module.exports = { protect, admin };
