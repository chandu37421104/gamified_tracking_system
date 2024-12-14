const Reward = require('../models/Reward');

// Add a New Reward
exports.addReward = async (req, res) => {
    try {
        const reward = new Reward(req.body);
        await reward.save();
        res.status(201).json(reward);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve All Rewards
exports.getRewards = async (req, res) => {
    try {
        const rewards = await Reward.find().populate('assignedTo', 'name email');
        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve Details of a Specific Reward
exports.getReward = async (req, res) => {
    try {
        const reward = await Reward.findById(req.params.id).populate('assignedTo', 'name email');
        if (!reward) return res.status(404).json({ error: 'Reward not found' });
        res.status(200).json(reward);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Reward
exports.updateReward = async (req, res) => {
    try {
        const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reward) return res.status(404).json({ error: 'Reward not found' });
        res.status(200).json(reward);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Reward
exports.deleteReward = async (req, res) => {
    try {
        const reward = await Reward.findByIdAndDelete(req.params.id);
        if (!reward) return res.status(404).json({ error: 'Reward not found' });
        res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrieve All Rewards of a Specific User
exports.getUserRewards = async (req, res) => {
    try {
        const rewards = await Reward.find({ assignedTo: req.params.userId }).populate('assignedTo', 'name email');
        res.status(200).json(rewards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Add a New Reward by Admin
exports.addRewardByAdmin = async (req, res) => {
    try {
        const reward = new Reward(req.body);
        await reward.save();
        res.status(201).json(reward);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Reward by Admin
exports.updateRewardByAdmin = async (req, res) => {
    try {
        const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reward) return res.status(404).json({ error: 'Reward not found' });
        res.status(200).json(reward);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a Reward by Admin
exports.deleteRewardByAdmin = async (req, res) => {
    try {
        const reward = await Reward.findByIdAndDelete(req.params.id);
        if (!reward) return res.status(404).json({ error: 'Reward not found' });
        res.status(200).json({ message: 'Reward deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};