const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlewares/error-handler");

require("dotenv").config();
const { login, createUser } = require("./controllers/users");
const { corsOptions } = require("./utils/config");
const { NOT_FOUND_ERROR_MESSAGE, NotFoundError } = require("./utils/errors");

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.post("/signin", login);
app.post("/signup", createUser);

app.use((req, res, next) => {
  return next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);

  if (!err.statusCode) {
    // Set default status code for unexpected errors
    err.statusCode = 500;
  }
  next(err);
});

app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
