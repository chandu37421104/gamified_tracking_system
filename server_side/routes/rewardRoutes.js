const express = require('express');
const {
    addReward,
    getRewards,
    getReward,
    updateReward,
    deleteReward,
    getUserRewards,
    addRewardByAdmin,
    updateRewardByAdmin,
    deleteRewardByAdmin,
} = require('../controllers/rewardController');

const authenticate = require('../middlewares/authMiddleware');
const verifyAdmin = require('../middlewares/verifyAdmin');

const router = express.Router();

// Public Routes
router.post('/', addReward); // Add a New Reward
router.get('/', getRewards); // Retrieve All Rewards
router.get('/:id', getReward); // Retrieve Details of a Specific Reward
router.put('/:id', updateReward); // Update a Reward
router.delete('/:id', deleteReward); // Delete a Reward
router.get('/user/:userId', getUserRewards); // Retrieve All Rewards of a Specific User

// Admin-Specific Routes
router.post('/admin', authenticate, verifyAdmin, addRewardByAdmin);  
router.put('/admin/:id', authenticate, verifyAdmin, updateRewardByAdmin); 
router.delete('/admin/:id', authenticate, verifyAdmin, deleteRewardByAdmin);

module.exports = router;



