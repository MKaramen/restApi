const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')

const Product = require('../models/product');

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "We got the GET to products"
  });
});

router.post("/", async (req, res, next) => {
  // Load model and fill it wit data
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });

  // Save to the db
  try {
    await product.save();
    res.status(201).json({
      message: "We got the POST to products",
      createdProduct: product
    });
  } catch (err) {
    res.status(500).json({
      error: err
    })
  }

});

router.get("/:productId", async (req, res, next) => {
  // Take the id from the url
  try {
    const id = req.params.productId;
    const find_product = await Product.findById(id);
    res.status(200).json(find_product);

  } catch (err) {
    console.error(err);
  }

});

router.patch("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Updated product"
  });
});

router.delete("/:productId", (req, res, next) => {
  res.status(200).json({
    message: "Deleted product"
  });
});

module.exports = router;