const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String }, // only for normal login
  githubId: { type: String, unique: true, sparse: true },
  googleId: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// // Define the user schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// // Middleware to hash the password before saving
// userSchema.pre('save', async function (next) {
//   const user = this;

//   // Only hash the password if it has been modified or is new
//   if (!user.isModified('password')) return next();

//   try {
//     // Generate a salt
//     const salt = await bcrypt.genSalt(10);

//     // Hash the password using the salt
//     user.password = await bcrypt.hash(user.password, salt);
//     next();
//   } catch (err) {
//     next(err); // Pass the error to the next middleware
//   }
// });

// // Export the User model
// module.exports = mongoose.model('User', userSchema);
