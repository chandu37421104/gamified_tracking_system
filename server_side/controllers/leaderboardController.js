const User = require('../models/User');
const Task = require('../models/Task');
const Reward = require('../models/Reward');

// Retrieve Leaderboard Rankings for a Specific Role
exports.getLeaderboard = async (req, res) => {
    try {
        const { role } = req.params;

        // Aggregate total points from tasks and rewards
        const leaderboard = await User.aggregate([
            { $match: { role } }, // Filter by role
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'assignedTo',
                    as: 'tasks'
                }
            },
            {
                $lookup: {
                    from: 'rewards',
                    localField: '_id',
                    foreignField: 'assignedTo',
                    as: 'rewards'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    totalPoints: {
                        $add: [
                            { $sum: '$tasks.points' },
                            { $sum: '$rewards.pointsRequired' }
                        ]
                    }
                }
            },
            { $sort: { totalPoints: -1 } } // Sort by total points (descending)
        ]);

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve Individual User Ranking for a Specific Role
exports.getUserRanking = async (req, res) => {
    try {
        const { role, userId } = req.params;

        // Aggregate total points and find ranking
        const leaderboard = await User.aggregate([
            { $match: { role } }, // Filter by role
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'assignedTo',
                    as: 'tasks'
                }
            },
            {
                $lookup: {
                    from: 'rewards',
                    localField: '_id',
                    foreignField: 'assignedTo',
                    as: 'rewards'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    totalPoints: {
                        $add: [
                            { $sum: '$tasks.points' },
                            { $sum: '$rewards.pointsRequired' }
                        ]
                    }
                }
            },
            { $sort: { totalPoints: -1 } } // Sort by total points (descending)
        ]);

        // Find user's ranking
        const userRanking = leaderboard.findIndex(user => user._id.toString() === userId);

        if (userRanking === -1) {
            return res.status(404).json({ error: 'User not found in this role\'s leaderboard' });
        }

        res.status(200).json({
            ranking: userRanking + 1,
            user: leaderboard[userRanking]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
