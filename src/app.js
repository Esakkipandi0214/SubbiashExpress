// app.js
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./DBConfig/db');
connectDB();

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

module.exports = app;


// const express = require('express');
// const app = express();
// const actionsRouter = require('./routes/actions');
// const actionsRouterUser = require('./routes/user');
// const todoRoutes = require('./routes/todoRoutes');
// const cors = require('cors');

// const connectDB = require('./DBConfig/db');
// require('dotenv').config();
// // const routes = require('./routes');
// connectDB();

// // Middleware
// app.use(cors({
//   origin: ['https://agenda-verse-build.vercel.app',"http://localhost:8080"], // Replace with your real frontend domain
//   credentials: true
// }));// Enable CORS with default options
// app.use(express.json()); // Parse JSON bodies

// // Routes
// app.use('/api/actions', actionsRouter);
// app.use('/api/userActions', actionsRouterUser);
// app.use('/api/todos', todoRoutes);

// // Default route
// app.get('/', (req, res) => {
//   res.send('Welcome to the Simple RESTful API!');
// });

// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({ message: 'Not Found' });
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Something went wrong!' });
// });

// module.exports = app;
