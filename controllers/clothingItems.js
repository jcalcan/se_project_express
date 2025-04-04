const ClothingItem = require("../models/clothingItem");
const { ObjectId } = require("mongoose").Types;
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  BAD_REQUEST_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  INVALID_NAME_AVATAR_MESSAGE,
  NAME_LENGTH_MESSAGE,
  INVALID_PHOTO_TYPE,
  ITEM_NOT_FOUND_MESSAGE,
  ITEM_DELETED_MESSAGE,
  ITEM_DELETE_FAIL_MESSAGE,
  INVALID_WEATHER_MESSAGE,
  ITEM_CREATED_MESSAGE,
  WEATHER_NAME_TYPE_INCORRECT_MESSAGE,
  AUTHENTICATION_FAIL_MESSAGE,
  INVALID_URL_MESSAGE,
} = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const clothes = await ClothingItem.find({});
    res.status(OK).json({ data: clothes });
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR).json({
      message: DEFAULT_ERROR_MESSAGE,
      error: err.message,
    });
  }
};

const createItem = async (req, res) => {
  const validWeatherTypes = ["hot", "warm", "cold"];

  if (!req.body.name || !req.body.weather || !req.body.imageUrl) {
    return res.status(BAD_REQUEST).json({
      message: INVALID_NAME_AVATAR_MESSAGE,
    });
  }
  if (
    req.body.name.trim() == "" ||
    req.body.weather.trim() == "" ||
    req.body.imageUrl.trim() == ""
  ) {
    return res.status(BAD_REQUEST).json({
      message: WEATHER_NAME_TYPE_INCORRECT_MESSAGE,
    });
  }

  if (req.body.name.length < 2 || req.body.name.length > 30) {
    return res.status(BAD_REQUEST).json({
      message: NAME_LENGTH_MESSAGE,
    });
  }
  if (!validWeatherTypes.includes(req.body.weather)) {
    return res.status(BAD_REQUEST).json({
      message: INVALID_WEATHER_MESSAGE,
    });
  }

  try {
    new URL(req.body.imageUrl);

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
    return res.status(BAD_REQUEST).json({
      message: INVALID_URL_MESSAGE,
    });
  }
};

const deleteItem = async (req, res) => {
  const { itemId } = req.params;

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

  //Validate itemId format
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
    res.status(OK).json(item);
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

  //validate itemId format
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
    res.status(OK).json(item);
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
