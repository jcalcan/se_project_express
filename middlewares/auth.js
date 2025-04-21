const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  UNAUTHORIZED,
  AUTHENTICATION_FAIL_MESSAGE,
} = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const error = new Error(AUTHENTICATION_FAIL_MESSAGE);
    error.statusCode = UNAUTHORIZED;
    return next(error);
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    err.statusCode = UNAUTHORIZED;
    err.message = AUTHENTICATION_FAIL_MESSAGE;
    return next(err);
  }
};

module.exports = auth;
