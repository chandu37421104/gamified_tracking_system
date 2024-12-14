const express = require('express');
const {
    getLeaderboard,
    getUserRanking
} = require('../controllers/leaderboardController');

const router = express.Router();

// Routes for Leaderboard Management
router.get('/:role', getLeaderboard); // Retrieve Leaderboard Rankings for a Specific Role
router.get('/:role/user/:userId', getUserRanking); // Retrieve Individual User Ranking for a Specific Role

module.exports = router;

