const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Utility: Generate a signed JWT token for a given user ID.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── @desc    Register a new user
// ─── @route   POST /api/auth/register
// ─── @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check for existing user with same email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user (password will be hashed by the pre-save hook in User model)
    const user = await User.create({ name, email, password });

    // Respond with user info and JWT token
    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Login user / admin
// ─── @route   POST /api/auth/login
// ─── @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user by email — include password field (excluded by default via `select: false`)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with hashed password in DB
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get currently logged-in user's profile
// ─── @route   GET /api/auth/me
// ─── @access  Private (requires JWT)
const getMe = async (req, res) => {
  // req.user is attached by the protect middleware
  res.json({
    _id:       req.user._id,
    name:      req.user.name,
    email:     req.user.email,
    role:      req.user.role,
    createdAt: req.user.createdAt,
  });
};

module.exports = { registerUser, loginUser, getMe };
