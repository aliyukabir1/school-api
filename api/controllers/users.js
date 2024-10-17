const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/users");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.get_users = (req, res) => {
  User.find()
    .exec()
    .then((doc) => {
      res.status(200).json({
        body: doc,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
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

            user
              .save()
              .then((value) => {
                res.status(201).json({
                  message: `User created successfully with email: ${req.body.email}`,
                });
              })
              .catch((err) => res.status(500).json({ error: err.message }));
          }
        });
      }
    });
};

exports.reset_password = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (req.body.oldPassword === req.body.newPassword)
        return res.status(500).json({
          message: "Can't use same password as the old one",
        });
      var storedPassword = user.password;
      bcrypt.compare(req.body.oldPassword, storedPassword, (error, result) => {
        if (result) {
          bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
            const filter = { email: user.email };
            const update = { password: hash };
            User.findOneAndUpdate(filter, update, { new: true }).exec();
            res.status(200).json({
              message: "Password Reset Successful",
            });
          });
        } else {
          res.status(500).json({
            message: "Old password is incorrect",
          });
        }
      });
    });
};

exports.forgot_password = (req, res) => {
  var email = req.body.email;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (user) {
        const reset_token = crypto.randomBytes(20).toString("hex");
        User.findOneAndUpdate(user, { reset_token }, { new: true }).exec();
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     auth: {
        //         user: 'chadrick87@ethereal.email',
        //         pass: 'CzQMqrDJMrx5YxYK9T'
        //     },
        //     tls:{
        //         rejectUnauthorized:false
        //     }
        // });
        // const mailOptions = {
        //   from: "aliyos",
        //   to: email,
        //   subject: "Password Reset",
        //   text: "This is just a test",
        // };
        // transporter.sendMail(mailOptions, (err, info) => {
        //   if (err) {
        //     console.log(err);
        //     res.status(500).send("Error sending email");
        //   } else {
        //     console.log(`Email sent: ${info.response}`);
        //     res
        //       .status(200)
        //       .send(
        //         "Check your email for instructions on resetting your password"
        //       );
        //   }
        // });

      } else {
        res.status(404).send("Email not found");
      }
    });
};

exports.delete_user = async (req,res)=>{
    try {
        var user = await  User.findByIdAndDelete(req.params.id).exec();
        res.status(200).json({
            message:"Deleted : "+ user.email 
        });   
    } catch (error) {
        res.status(404).json({message: "User not found "+ error});

    }
  
}

exports.get_user =  (req,res)=>{
    try {
         User.findOne({_id: req.params.id}).exec().then((user)=>{
            console.log(user)
            if (user){
                res.status(200).json({
                    message:"Sucess",
                   user :user
                });   
            }else{
        res.status(404).json({message: "User not found"});      
            }
         });
       
    } catch (error) {
        res.status(404).json({message: "User not found "+ error});

    }
  
}