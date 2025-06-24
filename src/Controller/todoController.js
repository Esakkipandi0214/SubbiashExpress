const Todo = require('../Model/Todo');
const mongoose = require('mongoose');

// Create
exports.createTodo = async (req, res) => {
  try {
    const todo = new Todo({ ...req.body });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: 'Error creating todo', details: err });
  }
};

// Read all by userId


exports.getTodosByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    const todos = await Todo.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'users', // 👈 Mongoose auto-creates this collection name
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
       {
    $project: {
      'user.password': 0 // 👈 Exclude password
    }
  },
      {
        $sort: { order: 1 }
      }
    ]);

    res.json(todos);
  } catch (err) {
    console.error('Aggregation error:', err);
    res.status(500).json({ error: 'Error fetching todos with user data', details: err.message || 'Unknown error' });
  }
};


// Read one by ID
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching todo', details: err });
  }
};

// Update
exports.updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Todo not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating todo', details: err });
  }
};

exports.updateTodoStatus = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Toggle the completed value
    const updated = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        completed: !todo.completed,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error toggling todo status', details: err });
  }
};


// Delete
exports.deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting todo', details: err });
  }
};
