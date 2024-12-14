const express = require('express');
const {
    getAllLeaderboards,
    createRole,
    updateRole,
    deleteRole,
    addUserByAdmin,
    deleteUserByAdmin,
} = require('../controllers/adminController');

const router = express.Router();

// Routes for Admin Management
router.get('/leaderboards', getAllLeaderboards); // View All Leaderboards
router.post('/roles', createRole);              // Create a Role
router.put('/roles/:id', updateRole);           // Update a Role
router.delete('/roles/:id', deleteRole);        // Delete a Role
router.post('/users', addUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);
module.exports = router;
