const { ObjectId } = require("mongoose").Types;
const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  BAD_REQUEST_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  ITEM_NOT_FOUND_MESSAGE,
  ITEM_DELETED_MESSAGE,
  ITEM_DELETE_FAIL_MESSAGE,
  AUTHENTICATION_FAIL_MESSAGE,
  INVALID_URL_MESSAGE,
  INVALID_AUTHENTICATION_MESSAGE,
} = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const clothes = await ClothingItem.find({});
    res.status(OK).json({ data: clothes });
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: DEFAULT_ERROR_MESSAGE,
    });
  }
};

const createItem = async (req, res) => {
  try {
    if (!URL.canParse(req.body.imageUrl)) {
      return res.status(BAD_REQUEST).json({
        message: INVALID_URL_MESSAGE,
      });
    }

    if (!req.user) {
      return res.status(BAD_REQUEST).json({
        message: AUTHENTICATION_FAIL_MESSAGE,
      });
    }
    const item = await ClothingItem.create({
      name: req.body.name,
      weather: req.body.weather,
      imageUrl: req.body.imageUrl,
      owner: req.user._id,
    });

    return res.status(CREATED).json(item);
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

const deleteItem = async (req, res) => {
  const { itemId } = req.params;

  const item = await ClothingItem.findById(itemId);
  if (!item || !item.owner.equals(req.user._id)) {
    return res
      .status(FORBIDDEN)
      .json({ message: INVALID_AUTHENTICATION_MESSAGE });
  }

  if (!ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: BAD_REQUEST_ERROR_MESSAGE });
  }

  try {
    const deletedItem = await ClothingItem.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(NOT_FOUND).json({ message: ITEM_NOT_FOUND_MESSAGE });
    }
    console.log(`Item successfully deleted with ID: ${itemId}`);
    return res.status(OK).json({ message: ITEM_DELETED_MESSAGE });
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: ITEM_DELETE_FAIL_MESSAGE });
  }
};

const likeItem = async (req, res) => {
  const { itemId } = req.params;

  if (!ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({
      message: BAD_REQUEST_ERROR_MESSAGE,
    });
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
      return res.status(NOT_FOUND).json({
        message: ITEM_NOT_FOUND_MESSAGE,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: DEFAULT_ERROR_MESSAGE,
    });
  }
};

const unlikeItem = async (req, res) => {
  const { itemId } = req.params;

  if (!ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({
      message: BAD_REQUEST_ERROR_MESSAGE,
    });
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
      return res.status(NOT_FOUND).json({
        message: ITEM_NOT_FOUND_MESSAGE,
      });
    }
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: DEFAULT_ERROR_MESSAGE,
    });
  }
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
