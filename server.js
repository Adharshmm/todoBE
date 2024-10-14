const express = require('express');
const bodyParser = require('body-parser');
const boardRoutes = require('./routes/boardRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors'); 

const app = express();
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON request body

// Use the routes
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
