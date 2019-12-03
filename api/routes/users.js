const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

router.get("/", async (req, res, next) => {
  try {
    const all_user = await User.find();
    res.status(200).json({
      message: "Fetched all user",
      users: all_user
    });
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const email_used = await User.find({
      email: req.body.email
    });
    // console.log(email_used);
    if (email_used.length != 0) {
      res.status(409).json({
        message: "Email already used"
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        try {
          if (err) {
            res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            await user.save();

            res.status(200).json({
              message: "User Created",
              id: user._id,
              email: user.email,
              password: user.password
            });
          }
        } catch (err) {
          res.status(500).json({
            message: err
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err
    });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const gotUser = await User.findOne({
      email: req.body.email
    });

    bcrypt.compare(req.body.password, gotUser.password, (err, result) => {
      if (err) {
        return result.status(401).json({
          message: "Login Failed"
        });
      }

      if (result) {
        return res.status(200).json({
          message: "Login succeded"
        });
      }

      return res.status(401).json({
        message: "Login Failed"
      });
    });
  } catch (err) {
    res.status(401).json({
      message: "Login Failed"
    });
  }
});

router.delete("/:userId", async (req, res, next) => {
  try {
    await User.deleteOne({
      _id: req.params.userId
    });
    res.status(200).json({
      message: "User Deleted"
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
