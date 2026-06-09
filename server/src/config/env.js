const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/prime-trade",
  jwtSecret: process.env.JWT_SECRET || "please-change-this-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  cookieSecure: process.env.COOKIE_SECURE === "true",
};

module.exports = { env };
