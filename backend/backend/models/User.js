const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, // Will use bcrypt in production
  role: { type: String, enum: ['ADMIN', 'MAINTENANCE', 'OPERATOR', 'VIEWER'], default: 'VIEWER' },
  email: { type: String, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

module.exports = mongoose.model("User", userSchema);
