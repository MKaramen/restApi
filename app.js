const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();
// const bodyParser = require("body-parser");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

// Connect To Db
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .catch(err => console.log("Failed to connect"));

app.use(morgan("dev"));
// Allow us to extract data from the url
app.use(express.urlencoded({
  extended: false
}));
// Allow us to extract json data
app.use(express.json());

// Give acces to other browser to our api
app.use((req, res, next) => {
  // Give acces to any client
  res.header("Acces-Control-Allow-Origin", "*");
  //What header can be sent with the request
  res.header(
    "Acces-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Adding all the route for each page
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Create error 404
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Handle all the error
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;