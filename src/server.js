// const app = require('./src/app');



// app.js
const express = require('express');
require('dotenv').config();

const connectDB = require('./DBConfig/db');
connectDB();

const app = express();
const cors = require('cors');

const actionsRouter = require('./routes/actions');
const actionsRouterUser = require('./routes/user');
const todoRoutes = require('./routes/todoRoutes');

// Middleware
app.use(cors({
  origin: ['https://agenda-verse-build.vercel.app', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/actions', actionsRouter);
app.use('/api/userActions', actionsRouterUser);
app.use('/api/todos', todoRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Simple RESTful API!');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Define Port
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});