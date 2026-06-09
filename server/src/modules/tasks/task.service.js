const { TaskModel } = require("../../models/Task");
const { HttpError } = require("../../utils/httpError");

function taskDto(task) {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description || null,
    status: task.status,
    priority: task.priority,
    userId: task.user
      ? task.user.toString()
      : task.userId
        ? task.userId.toString()
        : null,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

async function listTasks(user) {
  const tasks = await TaskModel.find({ user: user.userId })
    .sort({ createdAt: -1 })
    .lean();

  return tasks.map(taskDto);
}

async function getTaskById(user, id) {
  const task = await TaskModel.findById(id);

  if (!task) {
    throw new HttpError(404, "Task not found", "TASK_NOT_FOUND");
  }

  if (task.user.toString() !== user.userId) {
    throw new HttpError(403, "Forbidden", "FORBIDDEN");
  }

  return taskDto(task);
}

async function createTask(user, input) {
  const task = await TaskModel.create({
    title: input.title,
    description: input.description,
    status: input.status,
    priority: input.priority,
    user: user.userId,
  });

  return taskDto(task);
}

async function updateTask(user, id, input) {
  const task = await TaskModel.findById(id);

  if (!task) {
    throw new HttpError(404, "Task not found", "TASK_NOT_FOUND");
  }

  if (task.user.toString() !== user.userId) {
    throw new HttpError(403, "Forbidden", "FORBIDDEN");
  }

  const updatePayload = {};

  if (input.title !== undefined) updatePayload.title = input.title;
  if (input.description !== undefined)
    updatePayload.description = input.description;
  if (input.status !== undefined) updatePayload.status = input.status;
  if (input.priority !== undefined) updatePayload.priority = input.priority;

  const updatedTask = await TaskModel.findByIdAndUpdate(id, updatePayload, {
    new: true,
  });

  if (!updatedTask) {
    throw new HttpError(404, "Task not found", "TASK_NOT_FOUND");
  }

  return taskDto(updatedTask);
}

async function deleteTask(user, id) {
  const task = await TaskModel.findById(id);

  if (!task) {
    throw new HttpError(404, "Task not found", "TASK_NOT_FOUND");
  }

  if (task.user.toString() !== user.userId) {
    throw new HttpError(403, "Forbidden", "FORBIDDEN");
  }

  await TaskModel.findByIdAndDelete(id);

  return { id: task._id.toString() };
}

module.exports = { listTasks, getTaskById, createTask, updateTask, deleteTask };
