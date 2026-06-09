const { env } = require("../../config/env");
const { getCurrentUser, loginUser, registerUser } = require("./auth.service");

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: "lax",
    path: "/",
  };
}

async function register(req, res) {
  const result = await registerUser(req.body);
  res.cookie("accessToken", result.token, cookieOptions());
  return res
    .status(201)
    .json({
      message: "Registered successfully",
      user: result.user,
      accessToken: result.token,
    });
}

async function login(req, res) {
  const result = await loginUser(req.body);
  res.cookie("accessToken", result.token, cookieOptions());
  return res
    .status(200)
    .json({
      message: "Logged in successfully",
      user: result.user,
      accessToken: result.token,
    });
}

async function me(req, res) {
  const user = await getCurrentUser(req.user.userId);
  return res.status(200).json({ user });
}

async function logout(_req, res) {
  res.clearCookie("accessToken", cookieOptions());
  return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = { register, login, me, logout };
