const { ObjectId } = require("mongoose").Types;
const ClothingItem = require("../models/clothingItem");

const {
  CREATED,
  OK,
  BAD_REQUEST_ERROR_MESSAGE,
  ITEM_NOT_FOUND_MESSAGE,
  ITEM_DELETED_MESSAGE,
  AUTHENTICATION_FAIL_MESSAGE,
  INVALID_URL_MESSAGE,
  UnauthorizedError,
} = require("../utils/errors");

const { BadRequestError, NotFoundError } = require("../utils/api_errors/index");

const getItems = async (req, res, next) => {
  try {
    const clothes = await ClothingItem.find({});

    res.status(OK).json({ data: clothes });
  } catch (err) {
    // res.status(INTERNAL_SERVER_ERROR).json({
    //   message: DEFAULT_ERROR_MESSAGE,
    // });
    next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    if (!URL.canParse(req.body.imageUrl)) {
      return next(new BadRequestError(INVALID_URL_MESSAGE));
    }

    if (!req.user) {
      return next(new UnauthorizedError(AUTHENTICATION_FAIL_MESSAGE));
    }

    const item = await ClothingItem.create({
      name: req.body.name,
      weather: req.body.weather,
      imageUrl: req.body.imageUrl,
      owner: req.user._id,
    });

    console.log("Item created successfully");

    return res.status(CREATED).json(item);
  } catch (err) {
    console.log("Error occurred:", err);

    if (err.name === "ValidationError") {
      return next(new BadRequestError(INVALID_URL_MESSAGE));
    }

    return next(err);
  }
};

const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;
  try {
    if (!ObjectId.isValid(itemId)) {
      return next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
    }

    const result = await ClothingItem.deleteOne({
      _id: itemId,
      owner: req.user._id,
    });
    if (result.deletedCount === 0) {
      return next(new NotFoundError(ITEM_NOT_FOUND_MESSAGE));
    }
    console.log(`Item successfully deleted with ID: ${itemId}`);
    return res.status(OK).json({ message: ITEM_DELETED_MESSAGE });
  } catch (err) {
    console.error(err);

    return next(err);
  }
};

const likeItem = async (req, res, next) => {
  const { itemId } = req.params;

  if (!ObjectId.isValid(itemId)) {
    // return res.status(BAD_REQUEST).json({
    //   message: BAD_REQUEST_ERROR_MESSAGE,
    // });
    return next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
  }
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail();
    return res.status(OK).json(item);
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      // return res.status(NOT_FOUND).json({
      //   message: ITEM_NOT_FOUND_MESSAGE,
      // });
      return next(new NotFoundError(ITEM_NOT_FOUND_MESSAGE));
    }
    // return res.status(INTERNAL_SERVER_ERROR).json({
    //   message: DEFAULT_ERROR_MESSAGE,
    // });
    return next(error);
  }
};

const unlikeItem = async (req, res, next) => {
  const { itemId } = req.params;

  if (!ObjectId.isValid(itemId)) {
    return next(new BadRequestError(BAD_REQUEST_ERROR_MESSAGE));
  }
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail();
    return res.status(OK).json(item);
  } catch (error) {
    if (error.name === "DocumentNotFoundError") {
      return next(new NotFoundError(ITEM_NOT_FOUND_MESSAGE));
    }

    return next(error);
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
