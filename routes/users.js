const express = require("express");
const userRouter = express.Router();
const userModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const getSignedURL = require("../functions/getSignedURL.js");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const followModel = require("../models/Follow.js");
const postModel = require("../models/Post.js");
userRouter.post("/signup", async (req, res) => {
  if (req.body == null)
    return res.status(409).send("Please fill the required fields.");
  if (req.body.password === req.body.passwordRetype) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = new userModel({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
    });
    try {
      await user.save();
      res.status(201).send("User created successfully");
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).send("user already exists");
      }
    }
  }
});
userRouter.get("/id/:id", authenticateToken, async (req, res) => {
  if (req.params.id) {
    const user = await userModel.findOne({ _id: req.params.id }).exec();
    const following = await followModel.find({ "sender._id":user._id});
    const followers = await followModel.find({ "receiver._id":user._id});
    const postCount = await postModel.countDocuments({ 'user._id': user._id});
    if (user) {
      let signedProfilePic
      if (user.profilePic) {
        signedProfilePic =  await getSignedURL(user.profilePic);
      }
      const { backgroudPic, email, fname, lname, tag, _id } = user;
      const userResponse = {
        user: {
          backgroudPic,
          email,
          fname,
          lname,
          signedProfilePic,
          tag,
          _id,
        },
        following,
        followers,
        postCount,
      };
      res.status(200).json(userResponse);
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});
module.exports = userRouter;
