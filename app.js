const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/clothingItems"));

app.use((req, res) => {
  res.status(404).json({
    message: "Requested resource not found",
  });
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
