const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  BAD_REQUEST_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  INVALID_NAME_AVATAR_MESSAGE,
  EMPTY_NAME_AVATAR_MESSAGE,
  NAME_LENGTH_MESSAGE,
  INVALID_AVATAR_URL_MESSAGE,
  INVALID_URL_MESSAGE,
  DB_CREATE_ERROR_MESSAGE,
} = require("../utils/errors");

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).json({ data: users }))
    .catch((err) => {
      console.log(err.name);
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: DEFAULT_ERROR_MESSAGE,
      });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({
          message: NOT_FOUND_ERROR_MESSAGE,
        });
      }
      return res.status(OK).json({ data: user });
    })
    .catch((err) => {
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).json({
          message: BAD_REQUEST_ERROR_MESSAGE,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: DEFAULT_ERROR_MESSAGE,
      });
    });
};

const createUser = (req, res) => {
  if (req.body.name.trim() === "" || req.body.avatar.trim() === "") {
    return res.status(BAD_REQUEST).json({
      message: EMPTY_NAME_AVATAR_MESSAGE,
    });
  }

  if (req.body.name.length < 2 || req.body.name.length > 30) {
    return res.status(BAD_REQUEST).json({
      message: NAME_LENGTH_MESSAGE,
    });
  }
  try {
    if (!URL.canParse(req.body.avatar)) {
      return res.status(BAD_REQUEST).json({
        message: INVALID_AVATAR_URL_MESSAGE,
      });
    }
    const imagePattern = /\.(jpg|png|bmp)$/i;
    if (!imagePattern.test(req.body.avatar)) {
      return res.status(BAD_REQUEST).json({
        message: INVALID_AVATAR_URL_MESSAGE,
      });
    }
    return User.create({ name: req.body.name, avatar: req.body.avatar })
      .then((user) => res.status(CREATED).json({ data: user }))
      .catch((err) => {
        console.log(err.name);
        return res.status(INTERNAL_SERVER_ERROR).json({
          message: DB_CREATE_ERROR_MESSAGE,
        });
      });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({
        message: INVALID_URL_MESSAGE,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: DEFAULT_ERROR_MESSAGE,
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
};
