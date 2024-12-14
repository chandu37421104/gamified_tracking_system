const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Helper: Generate JWT Token
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register a New Account
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Create and save the new user
        const user = new User({ name, email, password, role });
        await user.save();

        // Generate token with userId and role
        const token = generateToken(user._id, user.role);
        res.status(201).json({ 
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token with userId and role
        const token = generateToken(user._id, user.role);
        res.status(200).json({ 
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Logout
exports.logout = async (req, res) => {
  try {
      // User is already authenticated by the middleware
      res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// Reset Password
exports.resetPassword = async (req, res) => {
  try {
      const { newPassword } = req.body;

      // Use req.userId from authenticate middleware
      const user = await User.findById(req.userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Update password
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

