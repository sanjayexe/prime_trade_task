const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const { env } = require("./config/env");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { swaggerSpec } = require("./config/swagger");
const { authRouter } = require("./modules/auth/auth.routes");
const { taskRouter } = require("./modules/tasks/task.routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many auth attempts, try again later.",
    code: "RATE_LIMITED",
  },
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/tasks", taskRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
