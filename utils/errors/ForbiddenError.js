const { FORBIDDEN } = require("../errors");

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN;
    this.name = "ForbiddenError";
  }
}

module.exports = ForbiddenError;
