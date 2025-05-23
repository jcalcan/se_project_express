const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { AUTHENTICATION_FAIL_MESSAGE } = require("../utils/errors");
const { UnauthorizedError } = require("../utils/api_errors/index");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError(AUTHENTICATION_FAIL_MESSAGE));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    return next();
  } catch (err) {
    return next(new UnauthorizedError(AUTHENTICATION_FAIL_MESSAGE));
  }
};

module.exports = auth;
