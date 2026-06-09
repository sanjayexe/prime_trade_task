const { UserModel } = require("../../models/User");
const { HttpError } = require("../../utils/httpError");
const { comparePassword, hashPassword } = require("../../utils/password");
const { signAccessToken } = require("../../utils/jwt");

function userDto(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function registerUser(input) {
  const existingUser = await UserModel.findOne({ email: input.email }).lean();

  if (existingUser) {
    throw new HttpError(409, "Email already registered", "EMAIL_EXISTS");
  }

  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: "USER",
  });

  const userObject = user.toObject();
  const dto = userDto(userObject);

  const token = signAccessToken({
    userId: dto.id,
    role: dto.role,
    email: dto.email,
    name: dto.name,
  });

  return { user: dto, token };
}

async function loginUser(input) {
  const user = await UserModel.findOne({ email: input.email }).select(
    "+passwordHash",
  );

  if (!user) {
    throw new HttpError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  const passwordMatches = await comparePassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid credentials", "INVALID_CREDENTIALS");
  }

  const dto = userDto(user.toObject());

  const token = signAccessToken({
    userId: dto.id,
    role: dto.role,
    email: dto.email,
    name: dto.name,
  });

  return { user: dto, token };
}

async function getCurrentUser(userId) {
  const user = await UserModel.findById(userId).select("-passwordHash");

  if (!user) {
    throw new HttpError(404, "User not found", "USER_NOT_FOUND");
  }

  return userDto(user.toObject());
}

module.exports = { registerUser, loginUser, getCurrentUser };
