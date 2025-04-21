const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  UNAUTHORIZED,
  NOT_FOUND,
  CREATED,
  OK,
  CONFLICT,
  BAD_REQUEST_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  INVALID_AVATAR_URL_MESSAGE,
  INVALID_URL_MESSAGE,
  AUTHENTICATION_FAIL_MESSAGE,
  INVALID_FIELDS_PROVIDED_FAIL_MESSAGE,
  DUPLICATE_EMAIL_CONFLICT_MESSAGE,
  USER_CREATED,
  USER_UPDATED,
  BadRequestError,
} = require("../utils/errors");

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!avatar) {
      throw new BadRequestError("Avatar URL is required");
    }

    const urlRegex = /^https?:\/\/\S+$/i;
    if (!urlRegex.test(avatar)) {
      throw new BadRequestError(INVALID_URL_MESSAGE);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(CONFLICT)
        .json({ message: DUPLICATE_EMAIL_CONFLICT_MESSAGE, data: null });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    delete user._doc.password;

    return res.status(CREATED).json({ data: user, message: USER_CREATED });
  } catch (err) {
    if (err.name === "ValidationError") {
      const error = new BadRequestError(err.message);
      return next(error);
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new BadRequestError("Email and password are required");
    return next(err);
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(OK).json({
      data: { avatar: user.avatar, email: user.email, token },
      message: "Login successful",
    });
  } catch (err) {
    err.statusCode = UNAUTHORIZED;
    err.message = AUTHENTICATION_FAIL_MESSAGE;
    return next(err);
  }
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).json({
          message: NOT_FOUND_ERROR_MESSAGE,
        });
      }
      return res
        .status(OK)
        .json({ data: user, message: "Current user retrieved successfully" });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
      }
      return next(err);
    });
};

const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (avatar) {
      const urlRegex = /^https?:\/\/\S+$/i;
      if (!urlRegex.test(avatar)) {
        throw new BadRequestError(INVALID_AVATAR_URL_MESSAGE);
      }
      updates.avatar = avatar;
    }

    if (Object.keys(updates).length === 0) {
      throw new BadRequestError(INVALID_FIELDS_PROVIDED_FAIL_MESSAGE);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(OK).json({ data: user, message: USER_UPDATED });
  } catch (err) {
    if (err.name === "ValidationError") {
      const error = new BadRequestError("Invalid data passed for user update");
      return next(error);
    }
    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};
