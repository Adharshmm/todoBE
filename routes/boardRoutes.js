const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// Get all boards
router.get('/allboards', boardController.getBoards);

// Create a new board
router.post('/createboards', boardController.createBoard);

// Delete a board
router.delete('/:id', boardController.deleteBoard);
//get board
router.get('/getboard/:id',boardController.getBoard)

module.exports = router;
