const fs = require('fs');
const path = require('path');

// Path to db.json file
const dbPath = path.join(__dirname, '../db.json');

// Helper function to read from db.json
const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write to db.json
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Get all boards
exports.getBoards = (req, res) => {
  const dbData = readDB();
  res.status(200).json(dbData.tododata);
};

// Create a new board
exports.createBoard = (req, res) => {
  const { name } = req.body;
  const dbData = readDB();
  const newBoard = {
    id: dbData.tododata.length + 1, // Ensure unique ID
    name,
    columns: [
      { id: "todo", name: "To do", tasks: [] },
      { id: "doing", name: "Doing", tasks: [] },
      { id: "done", name: "Done", tasks: [] }
    ]
  };
  dbData.tododata.push(newBoard);
  writeDB(dbData);
  res.status(201).json(newBoard);
};

// Delete a board
exports.deleteBoard = (req, res) => {
  const { id } = req.params;
  const dbData = readDB();
  dbData.tododata = dbData.tododata.find((board) => board.id !== parseInt(id));
  writeDB(dbData);
  res.status(204).send();
};
// Get a single board
exports.getBoard = (req, res) => {
  const { id } = req.params;
  const dbData = readDB();
  const board = dbData.tododata.find((board) => board.id === parseInt(id));
  if (board) {
    res.status(200).json(board);
  } else {
    res.status(404).json({ message: "Board not found" });
  }
};