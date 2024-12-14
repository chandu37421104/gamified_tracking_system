const express = require('express');
const {
    addTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    getUserTasks
} = require('../controllers/taskController');

const router = express.Router();

// Routes for Task Management
router.post('/', addTask); // Create a New Task
router.get('/', getTasks); // Retrieve All Tasks
router.get('/:id', getTask); // Retrieve the Details of a Specific Task
router.put('/:id', updateTask); // Update a Task
router.delete('/:id', deleteTask); // Delete a Task
router.get('/user/:userId', getUserTasks); // Retrieve all Tasks of a Specific User

module.exports = router;


