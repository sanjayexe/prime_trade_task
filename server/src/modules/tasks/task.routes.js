const { Router } = require("express");
const { asyncHandler } = require("../../middleware/asyncHandler");
const { requireAuth } = require("../../middleware/auth");
const {
  createNewTask,
  getTask,
  getTasks,
  removeTask,
  updateExistingTask,
} = require("./task.controller");

const taskRouter = Router();

taskRouter.use(requireAuth);
taskRouter.get("/", asyncHandler(getTasks));
taskRouter.get("/:id", asyncHandler(getTask));
taskRouter.post("/", asyncHandler(createNewTask));
taskRouter.patch("/:id", asyncHandler(updateExistingTask));
taskRouter.delete("/:id", asyncHandler(removeTask));

module.exports = { taskRouter };
