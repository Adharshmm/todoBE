const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Create a new task
router.post('/:boardId/addtask', taskController.createTask);

// Update task status
router.put('/:boardId/tasks/:taskId', taskController.updateTaskStatus);

// Delete a task
router.delete('/:boardId/tasks/:taskId', taskController.deleteTask);

module.exports = router;
