const express = require("express");
const userRouter = express.Router();
const userModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {getSignedURL} = require("../functions/gcsFunctions.js");
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
      console.log(user)
      await user.save();
      res.status(201).send("User created successfully");
    } catch (error) {
      console.log(error.toString())
      if (error.code === 11000) {
        return res.status(409).send("user already exists");
      }
    }
  }
});
userRouter.get("/id", authenticateToken, async (req, res) => {
  console.log(req.query)
  if (req.query.visitedUserId && req.query.userId) {
    const visitedObjectId = new mongoose.Types.ObjectId(req.query.visitedUserId)
    const [user, following, followers, postCount] = await Promise.all([
      userModel.findOne({ _id: visitedObjectId}).exec(),
      followModel.find({ "sender._id": visitedObjectId}),
      followModel.find({ "receiver._id": visitedObjectId }),
      postModel.countDocuments({ "user._id": visitedObjectId }),
    ]);
    if (user) {
      let followedByLoggedUser = false
      for(let follower of followers){
        if(follower.sender._id.toString() === req.query.userId){
          followedByLoggedUser = true
          break;
        }
      }
      let signedProfilePic;
      if (user.profilePic) {
        signedProfilePic = await getSignedURL(user.profilePic);
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
        followingCount: following.length,
        followersCount: followers.length,
        followedByLoggedUser,
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
