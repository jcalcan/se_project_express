const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  BAD_REQUEST_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  INVALID_AVATAR_URL_MESSAGE,
  INVALID_URL_MESSAGE,
  DB_CREATE_ERROR_MESSAGE,
  AUTHENTICATION_FAIL_MESSAGE,
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

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!avatar) {
      throw new BAD_REQUEST("Avatar URL is required");
    }

    const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i;
    if (!urlRegex.test(avatar)) {
      throw new BAD_REQUEST("Avatar must be a valid image URL");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    res.status(CREATED).json({ data: user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(OK).json({ data: avatar, email, token });
  } catch (err) {
    return res.status(UNAUTHORIZED).json({
      message: AUTHENTICATION_FAIL_MESSAGE,
    });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  login,
};
