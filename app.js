const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const { login, createUser } = require("./controllers/users");
const { corsOptions } = require("./utils/config");
const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  DEFAULT_ERROR_MESSAGE,
} = require("./utils/errors");

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.post("/signin", login);
app.post("/signup", createUser);

app.use((req, res) => {
  res.status(NOT_FOUND).json({
    message: "Requested resource not found",
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.log(err);
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }
  return res.status(INTERNAL_SERVER_ERROR).json({ msg: DEFAULT_ERROR_MESSAGE });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`);
});
