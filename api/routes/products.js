const express = require("express");
const router = express.Router();
const mongoose = require('mongoose')

const Product = require('../models/product');

router.get("/", async (req, res, next) => {
  try {
    const all_products = await Product.find().select('_id name price')

    const response = {
      count: all_products.length,
      product: all_products.map(product => {
        return {
          _id: product.id,
          name: product.name,
          price: product.price,
          request: {
            type: "GET",
            url: 'http://localhost:3000/products/' + product.id
          }

        }
      })
    };

    if (all_products.length > 0) {
      res.status(200).json(response)
    } else {
      res.status(404).json({
        error: "DataBase is empty"
      })
    };
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    })
  }
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
      message: "Created object",
      createdProduct: {
        name: product.name,
        price: product.price,
        id: product._id,
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/' + product.id
        }
      }
    });
  } catch (err) {
    console.log(err);
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
    if (find_product) {
      res.status(200).json(find_product);
    } else {
      res.status(404).json({
        message: "The id doesn't exist"
      })
    }

  } catch (err) {
    console.error(err);
  }

});

router.patch("/:productId", async (req, res, next) => {
  try {
    const id = req.params.productId;

    const propertiesToUpdate = {};

    // console.log(req.body) => [ { propName: 'price', value: 50 } ]


    for (const properties of req.body) {
      // console.log(properties) => { propName: 'price', value: 50 } 
      propertiesToUpdate[properties.propName] = properties.value;
    }

    const updated_product = await Product.updateOne({
      _id: id
    }, propertiesToUpdate);
    res.status(200).json({
      message: "Updated product",
      product: updated_product
    });
  } catch (err) {
    console.error(err);
  }
});

router.delete("/:productId", async (req, res, next) => {
  try {
    // Get ID from URL 
    const id = req.params.productId;

    const deleted_item = await Product.deleteOne({
      _id: id
    });

    res.status(200).json({
      message: "Deleted product",
      item: deleted_item
    });

  } catch (err) {
    console.error(err);
    res.json({
      error: err
    })
  }
});

module.exports = router;