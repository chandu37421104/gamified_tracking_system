const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    permissions: {
        type: [String], // List of permissions associated with the role
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Role', RoleSchema);
