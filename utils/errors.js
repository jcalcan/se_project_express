const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const FORBIDDEN = 403;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;
const CREATED = 201;
const OK = 200;

const BAD_REQUEST_ERROR_MESSAGE = "Invalid data provided";
const NOT_FOUND_ERROR_MESSAGE = "Requested resource not found";
const DEFAULT_ERROR_MESSAGE = "An error has occurred on the server";
const INVALID_NAME_AVATAR_MESSAGE = "Please enter a valid name and avatar.";
const EMPTY_NAME_AVATAR_MESSAGE =
  "Name and Avatar cannot be empty. Please re-enter.";
const NAME_LENGTH_MESSAGE = "Name length must be between 2 and 30 characters";
const INVALID_AVATAR_URL_MESSAGE = "Avatar URL must end with .jpg, .png, .bmp";
const INVALID_URL_MESSAGE = "Please enter a valid URL";
const INVALID_EMAIL_MESSAGE = "Please enter a valid EMAIL";
const DB_CREATE_ERROR_MESSAGE = "Failed to create User in Database.";
const INVALID_PHOTO_TYPE = "Clothing photo must end with .jpg or .png";
const ITEM_CREATED_MESSAGE = "Item created successfully";
const ITEM_NOT_FOUND_MESSAGE = "Item not found";
const ITEM_DELETED_MESSAGE = "Item successfully deleted";
const ITEM_DELETE_FAIL_MESSAGE = "Failed to delete item";
const INVALID_WEATHER_MESSAGE =
  "Weather type is invalid. Select hot, cold or warm.";
const WEATHER_NAME_TYPE_INCORRECT_MESSAGE =
  "Name, weather type cannot be blank";

const AUTHENTICATION_FAIL_MESSAGE = "User Authentication Failed.";
const INVALID_FIELDS_PROVIDED_FAIL_MESSAGE =
  "At least one field (name or avatar) must be provided";
const INVALID_AUTHENTICATION_MESSAGE =
  "Unauthorized permission to access resource on server";
const DUPLICATE_EMAIL_CONFLICT_MESSAGE = "Email already exists";
const USER_CREATED = "User Successfully created";
const USER_UPDATED = "User Successfully Updated";

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
    this.name = "BadRequestError";
  }
}

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
  CREATED,
  OK,
  CONFLICT,
  BadRequestError,
  USER_CREATED,
  USER_UPDATED,
  BAD_REQUEST_ERROR_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  INVALID_NAME_AVATAR_MESSAGE,
  EMPTY_NAME_AVATAR_MESSAGE,
  NAME_LENGTH_MESSAGE,
  INVALID_AVATAR_URL_MESSAGE,
  INVALID_URL_MESSAGE,
  DB_CREATE_ERROR_MESSAGE,
  INVALID_PHOTO_TYPE,
  ITEM_CREATED_MESSAGE,
  ITEM_NOT_FOUND_MESSAGE,
  ITEM_DELETED_MESSAGE,
  ITEM_DELETE_FAIL_MESSAGE,
  INVALID_WEATHER_MESSAGE,
  WEATHER_NAME_TYPE_INCORRECT_MESSAGE,
  AUTHENTICATION_FAIL_MESSAGE,
  INVALID_FIELDS_PROVIDED_FAIL_MESSAGE,
  INVALID_AUTHENTICATION_MESSAGE,
  DUPLICATE_EMAIL_CONFLICT_MESSAGE,
};
