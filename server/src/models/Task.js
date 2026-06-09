const mongoose = require('mongoose');
const { taskPriorities, taskStatuses } = require('../types/domain');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true },
    status: { type: String, enum: taskStatuses, default: 'TODO', required: true },
    priority: { type: String, enum: taskPriorities, default: 'MEDIUM', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

taskSchema.index({ status: 1 });

const TaskModel = mongoose.model('Task', taskSchema);

module.exports = { TaskModel };