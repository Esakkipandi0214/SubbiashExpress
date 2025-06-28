const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const router = express.Router();
const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Route to get all users
router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
      const users = await User.findById(id);
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  router.get('/name/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

  // Route to create a new user
  router.post('/', async (req, res) => {
    try {
      const { name, email, password } = req.body;

       // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

     // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'This email is already registered. Please login.' });
    }

    // Optional: Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Optional: Enforce password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

      const user = new User({ name, email, password });
      await user.save();
       const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered',
      user: {
        userId: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
    } catch (err) { 
      // Generic fallback
    res.status(500).json({
      error: 'Something went wrong. Please try again later.'
    });
      // res.status(400).json({ error: err.message });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'We couldn’t find your account. Please double-check your email and try again.' });
      }
  
      // Compare the plain-text password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Your email or password didn’t match. Please try again.' });
      }
  const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.put('/userPassUpdate/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the id from request params
        const { email, password } = req.body;

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        // Find and update the user by id
        const user = await User.findByIdAndUpdate(
            id,                     // The id from request params
            { email, password },     // Updated fields
            { new: true, runValidators: true } // Return the updated user, apply validation
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

  router.put('/updateUser/:id', async (req, res) => {
    try {
        const { id } = req.params; // Extract the id from request params
        const { name,email } = req.body;

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid User ID' });
        }

        // Find and update the user by id
        const user = await User.findByIdAndUpdate(
            id,                     // The id from request params
            {name, email },     // Updated fields
            { new: true, runValidators: true } // Return the updated user, apply validation
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const { id } = req.params;

// Validate ObjectId
if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid User ID' });
}
        
        // Find user by id
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



  
  module.exports = router;