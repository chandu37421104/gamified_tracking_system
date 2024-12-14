const express = require('express');
const {
    addRewardByAdmin,
    updateRewardByAdmin,
    deleteRewardByAdmin,
} = require('../controllers/rewardController');
const authenticate = require('../middlewares/authMiddleware'); // Middleware for authentication

const router = express.Router();

// Middleware to ensure admin role
const requireAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};

// Routes for Admin Reward Management
router.post('/', authenticate, requireAdmin, addRewardByAdmin);       // Add a New Reward
router.put('/:id', authenticate, requireAdmin, updateRewardByAdmin); // Update a Reward
router.delete('/:id', authenticate, requireAdmin, deleteRewardByAdmin); // Delete a Reward

module.exports = router;
