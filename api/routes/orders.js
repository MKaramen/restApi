const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')

const Order = require('../models/order')

router.get("/", async (req, res, next) => {
  await Order.find()
  res.status(200).json({
    message: "Orders were fetched"
  });
});

router.post("/", async (req, res, next) => {
  try {
    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    })

    await newOrder.save();

    res.status(201).json({
      message: "Orders were created",
      order: newOrder
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err
    })
  }
});

router.get("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Orders details",
    orderId: req.params.orderId
  });
});

router.delete("/:orderId", (req, res, next) => {
  res.status(200).json({
    message: "Orders deleted",
    orderId: req.params.orderId
  });
});

module.exports = router;