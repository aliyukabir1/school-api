const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/users");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

exports.get_users = (req, res) => {
  
User.find().exec().then(doc=>{
    res.status(200).json({
        body:doc
    })
}).catch(err=>{
    res.status(500).json(err)
})
};

// sign in
exports.sign_in = (req, res) => {
  //find the user by email
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        // check if req password == hash stored in db?
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (result) {
            // if ==, generate a token.
            const token = jwt.sign(
              { email: user.email, _id: user._id },
              "my_secret_key",
              {
                expiresIn: "1h",
              }
            );
            res.status(200).json({
              message: "Login Successful",
              token: token,
            });
          } else {
            res.status(500).json({
              message: "Incorrect Password",
            });
          }
        });
      } else {
        res.status(500).json({
          message: "User not found",
        });
      }
    });
};

exports.sign_up = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((value) => {
      if (value.length > 0) {
        res.status(500).json({ message: "User already exist" });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ message: err.message });

            return;
          } else {
            const user = User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });

            user.save().then((value) => {
              res
                .status(201)
                .json({
                  message: `User created successfully with email: ${req.body.email}`,
                })
                .catch((err) => res.status(500).json({ error: err.message }));
            });
          }
        });
      }
    });
};
