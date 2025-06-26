import mongoose from "mongoose";
import express from "express";
import userModel from "../models/User.js";
import likeModel from "../models/Like.js";
import authenticateToken from "../middleware/tokenAuthFilter.js";

const likeRouter = express.Router();


likeRouter.post("/", authenticateToken, async (req, res) => {
  const like = await likeModel
    .findOne({ userId: req.body.userId, contentId: req.body.contentId })
    .exec();
  if (!like) {
    const newLike = new likeModel({
      userId: req.body.userId,
      contentId: req.body.contentId,
    });
    await newLike.save();
    res.sendStatus(201);
  } else {
    await likeModel.deleteOne(like);
    res.sendStatus(204);
  }
});

export default  likeRouter;
