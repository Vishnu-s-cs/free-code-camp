const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

exports.validate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name.trim(),
      email: req.body.email,
      password: hashedPassword,
    });
    await user
      .save()
      .then((user) => {
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.userLogin = async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      const user = await User.findOne({
        email: req.body.email,
      });
      !user && res.status(404).json("user not found");

      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        !validPassword && res.status(400).json("wrong password");

        if (validPassword) {
          const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET,
            { expiresIn: "7d" }
          );
          const { password, updatedAt, createdAt, ...other } = user._doc;
          res
            .cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: true,
            })
            .status(200)
            .json({ other, accessToken });
        }
      }
    } else {
      res.status(400).json("please fill all the credentials");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
