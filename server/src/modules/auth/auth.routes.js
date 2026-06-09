const { Router } = require("express");
const { asyncHandler } = require("../../middleware/asyncHandler");
const { login, logout, me, register } = require("./auth.controller");
const { requireAuth } = require("../../middleware/auth");

const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.get("/me", requireAuth, asyncHandler(me));
authRouter.post("/logout", requireAuth, asyncHandler(logout));

module.exports = { authRouter };
