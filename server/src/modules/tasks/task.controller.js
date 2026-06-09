const {
  createTask,
  deleteTask,
  getTaskById,
  listTasks,
  updateTask,
} = require("./task.service");

async function getTasks(req, res) {
  const tasks = await listTasks(req.user);
  return res.status(200).json({ tasks });
}

async function getTask(req, res) {
  const task = await getTaskById(req.user, req.params.id);
  return res.status(200).json({ task });
}

async function createNewTask(req, res) {
  const task = await createTask(req.user, req.body);
  return res.status(201).json({ message: "Task created successfully", task });
}

async function updateExistingTask(req, res) {
  const task = await updateTask(req.user, req.params.id, req.body);
  return res.status(200).json({ message: "Task updated successfully", task });
}

async function removeTask(req, res) {
  const result = await deleteTask(req.user, req.params.id);
  return res
    .status(200)
    .json({ message: "Task deleted successfully", task: result });
}

module.exports = {
  getTasks,
  getTask,
  createNewTask,
  updateExistingTask,
  removeTask,
};
