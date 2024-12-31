const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified or is new
  if (!user.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
