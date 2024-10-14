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

// Create a new task
exports.createTask = (req, res) => {

  console.log('Inside createTask controller')
  const { boardId, task } = req.body;
  const dbData = readDB();
  const board = dbData.tododata.find((b) => b.id === parseInt(boardId));

  if (board) {
    const taskExists = board.columns.some(column =>
      column.tasks.some(t => t.task === task)
    );

    if (taskExists) {
      return res.status(409).json({ message: 'Task already exists' });
    } else {
      const newTask = {
        id: Date.now(), // Unique ID for the task
        task,
        status: 'incomplete' // Default status for new tasks
      };
      board.columns[0].tasks.push(newTask); // Add to the 'todo' column
      writeDB(dbData);
      return res.status(201).json(newTask);
    }
  }
  res.status(404).json({ message: 'Board not found' });
};

// Update task status
exports.updateTaskStatus = (req, res) => {
  const { boardId, taskId } = req.params;
  const { status } = req.body; // The new status (todo, doing, done)

  const dbData = readDB();
  const board = dbData.tododata.find((b) => b.id === parseInt(boardId));

  if (board) {
    let task;
    // Find task in all columns
    for (const column of board.columns) {
      task = column.tasks.find((t) => t.id === parseInt(taskId));
      if (task) break;
    }

    if (task) {
      // Remove task from current column
      for (const column of board.columns) {
        column.tasks = column.tasks.filter((t) => t.id !== parseInt(taskId));
      }

      // Add task to new column based on status
      const targetColumn = board.columns.find(col => col.id === status);
      if (targetColumn) {
        targetColumn.tasks.push(task);
        writeDB(dbData);
        return res.status(200).json({ message: 'Task updated successfully' });
      }
    }
  }
  res.status(404).json({ message: 'Board or task not found' });
};

// Delete a task
exports.deleteTask = (req, res) => {
  const { boardId, taskId } = req.params;
  const dbData = readDB();
  const board = dbData.tododata.find((b) => b.id === parseInt(boardId));

  if (board) {
    // Remove task from all columns
    for (const column of board.columns) {
      column.tasks = column.tasks.filter((t) => t.id !== parseInt(taskId));
    }
    writeDB(dbData);
    return res.status(204).send();
  }
  res.status(404).json({ message: 'Board not found' });
};
