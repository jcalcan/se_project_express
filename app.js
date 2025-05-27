require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateAuthentication,
  validateSignup,
} = require("./middlewares/validation");

const { login, createUser } = require("./controllers/users");
const { corsOptions } = require("./utils/config");
const { NOT_FOUND_ERROR_MESSAGE } = require("./utils/errors");
const { NotFoundError } = require("./utils/api_errors/index");

const { PORT = 3001 } = process.env;
const app = express();

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.post("/signin", validateAuthentication(), login);
app.post("/signup", validateSignup(), createUser);

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.use((req, res, next) => next(new NotFoundError(NOT_FOUND_ERROR_MESSAGE)));

app.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
