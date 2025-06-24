const express = require('express');
const router = express.Router();
const auth = require('../utils/auth'); // 👈 path to the middleware
const {
  createTodo,
  getTodosByUser,
  getTodoById,
  updateTodo,
  deleteTodo,updateTodoStatus
} = require('../Controller/todoController');

router.post('/',auth, createTodo);
router.get('/user/:userId',auth, getTodosByUser);
router.get('/:id',auth, getTodoById);
router.put('/:id',auth, updateTodo);
router.put('/status/:id',auth, updateTodoStatus);
router.delete('/:id',auth, deleteTodo);

module.exports = router;
