const mongoose = require('mongoose');
const { roles } = require('../types/domain');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: roles, default: 'USER', required: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };