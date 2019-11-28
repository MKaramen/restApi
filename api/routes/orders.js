const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')

const Order = require('../models/order')
const Product = require('../models/product')

router.get("/", async (req, res, next) => {
  try {
    const all_order = await Order.find().select('_id quantity product')
    res.status(200).json({
      message: "Orders were fetched",
      count: all_order.length,
      orders: all_order
    });
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: err
    })
  }

});

router.post("/", async (req, res, next) => {
  try {
    await Product.findById(req.body.productId);

    const newOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId
    })

    await newOrder.save();

    res.status(201).json({
      message: "Order was created",
      order: newOrder
    });

  } catch (err) {
    if (err.kind == "ObjectId") {
      res.status(404).json({
        message: 'Product ID not found'
      })
    } else {
      console.error(err);
      res.status(500).json({
        error: err
      })
    }
  }
});

router.get("/:orderId", async (req, res, next) => {

  try {
    const id = req.params.orderId;
    const orderDetails = await Order.findById(id);

    res.status(200).json({
      message: "Orders details",
      orderId: orderDetails.id,
      relatedProductID: orderDetails.product,
      quantity: orderDetails.quantity
    });

  } catch (err) {
    if (err.kind == "ObjectId") {
      res.status(404).json({
        error: "Order ID not found"
      })
    }
    console.error(err);
    res.status(500).json({
      error: err
    })
  }

});

router.delete("/:orderId", async (req, res, next) => {
  try {
    const id = req.params.orderId;
    console.log(id);

    await Order.deleteOne({
      _id: id
    })
    res.status(200).json({
      message: "Orders deleted",
      orderId: req.params.orderId
    });

  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: err
    })
  }
});

module.exports = router;