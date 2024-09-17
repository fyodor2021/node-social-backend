const mongoose = require("mongoose");
const express = require("express");
const userModel = require("../models/User.js");
const likeModel = require("../models/Like.js");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const likeRouter = express.Router();

likeRouter.post("/", authenticateToken, async (req, res) => {
  console.log(req.body);
  const like = await likeModel
    .findOne({ userId: req.body.userId, contentId: req.body.contentId })
    .exec();
  console.log(like);
  if (!like) {
    const newLike = new likeModel({
      userId: req.body.userId,
      contentId: req.body.contentId,
    });
    await newLike.save();
    res.sendStatus(201);
  } else {
    console.log('im here')
    await likeModel.deleteOne(like);
    res.sendStatus(204);
  }
});

module.exports = likeRouter;
