const { HttpError } = require("../utils/httpError");
const { verifyAccessToken } = require("../utils/jwt");

function requireAuth(req, _res, next) {
  const bearerToken =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined;
  const cookieToken = req.cookies && req.cookies.accessToken;
  const token = bearerToken || cookieToken;

  if (!token) {
    throw new HttpError(401, "Authentication required", "UNAUTHORIZED");
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new HttpError(401, "Invalid or expired token", "UNAUTHORIZED");
  }
}
module.exports = { requireAuth };
