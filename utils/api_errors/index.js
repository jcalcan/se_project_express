const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const ConflictError = require("./ConflictError");
const ForbiddenError = require("./ForbiddenError");
const UnauthorizedError = require("./UnauthorizedError");

module.exports = {
  BadRequestError,
  NotFoundError,
  ConflictError,
  ForbiddenError,
  UnauthorizedError,
};
