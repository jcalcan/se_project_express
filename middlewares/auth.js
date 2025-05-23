const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { AUTHENTICATION_FAIL_MESSAGE } = require("../utils/errors");
const { UnauthorizedError } = require("../utils/api_errors/index");

const auth = (req, res, next) => {
  console.log("Auth middleware started");
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.log("No authorization header or invalid format");
    return next(new UnauthorizedError(AUTHENTICATION_FAIL_MESSAGE));
  }

  const token = authorization.replace("Bearer ", "");
  console.log("Token extracted, attempting verification");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log("Token verified successfully");
    req.user = payload;
    console.log("User payload attached to request");
    return next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    return next(new UnauthorizedError(AUTHENTICATION_FAIL_MESSAGE));
  }
};

module.exports = auth;
