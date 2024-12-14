const User = require('../models/User');
const Task = require('../models/Task');
const Reward = require('../models/Reward');
const Role = require('../models/Role'); // Role model (if you manage roles separately)

// View All Leaderboards
exports.getAllLeaderboards = async (req, res) => {
    try {
        const roles = ['student', 'faculty', 'graduate', 'admin'];

        const leaderboards = await Promise.all(
            roles.map(async (role) => {
                const leaderboard = await User.aggregate([
                    { $match: { role } },
                    {
                        $lookup: {
                            from: 'tasks',
                            localField: '_id',
                            foreignField: 'assignedTo',
                            as: 'tasks',
                        },
                    },
                    {
                        $lookup: {
                            from: 'rewards',
                            localField: '_id',
                            foreignField: 'assignedTo',
                            as: 'rewards',
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            email: 1,
                            totalPoints: {
                                $add: [
                                    { $sum: '$tasks.points' },
                                    { $sum: '$rewards.pointsRequired' },
                                ],
                            },
                        },
                    },
                    { $sort: { totalPoints: -1 } },
                ]);
                return { role, leaderboard };
            })
        );

        res.status(200).json(leaderboards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a Role
exports.createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        const role = new Role({ name, permissions });
        await role.save();

        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Role
exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const role = await Role.findByIdAndUpdate(id, updatedData, { new: true });
        if (!role) return res.status(404).json({ error: 'Role not found' });

        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Role
exports.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByIdAndDelete(id);
        if (!role) return res.status(404).json({ error: 'Role not found' });

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addUserByAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Ensure only valid roles are assigned
        const validRoles = ['student', 'faculty', 'graduate', 'admin'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role specified' });
        }

        const user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'Email already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
// Delete User by Admin
exports.deleteUserByAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
