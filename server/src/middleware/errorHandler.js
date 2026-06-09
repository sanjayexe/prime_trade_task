const { HttpError } = require("../utils/httpError");

function notFoundHandler(req, _res, next) {
  next(
    new HttpError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}`,
      "NOT_FOUND",
    ),
  );
}

function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message,
      code: error.code,
    });
  }

  console.error(error);
  return res.status(500).json({
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
}

module.exports = { notFoundHandler, errorHandler };
