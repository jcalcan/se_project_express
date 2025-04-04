module.exports = (req, res, next) => {
  req.user = { _id: "67ecae9882f4e36adf710e93" };
  next();
};
