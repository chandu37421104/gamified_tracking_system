const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    pointsRequired: {
        type: Number,
        required: true,
        min: 0,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Reward', RewardSchema);




