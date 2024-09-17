const express = require("express");
const mongoose = require("mongoose");
const postModel = require("../models/Post.js");
const userModel = require("../models/User.js");
const commentModel = require("../models/Comment.js");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const commentRouter = express.Router();
const getSignedURL = require("../functions/getSignedURL.js");
const likeModel = require("../models/Like.js");
commentRouter.get("/", authenticateToken, async (req, res) => {
  console.log(req.query);
  const comments = await commentModel
    .find({ contentId: req.query.contentId })
    .skip(req.query.offset)
    .limit(3)
    .sort({ date: -1 })
    .exec();
  const commentResponse = [];
  if (comments) {
    for (let comment of comments) {
      commentResponse.push(await prepareCommentResponse(comment,req.query.userId));
    }
    res.status(200).send(commentResponse);
  } else {
    res.sendStatus(204);
  }
});

commentRouter.get("/id", authenticateToken, async (req, res) => {
  const comments = await commentModel.find({ contentId: req.query.commentId }).exec();
  const commentResponse = [];
  if (comments) {
    for (let comment of comments) {
      commentResponse.push(await prepareCommentResponse(comment,req.query.userId));
    }
    res.status(201).send(commentResponse);
  } else {
    res.sendStatus(204);
  }
});

commentRouter.post("/", authenticateToken, async (req, res) => {
  console.log(req.body)
  let content = await postModel.findOne({ _id: req.body.contentId });
  if (!content) {
    content = await commentModel.findOne({ _id: req.body.contentId });
  }
  console.log(content)
  if (content) {
    const comment = new commentModel({
      user: {
        _id: req.body.user._id,
        lname: req.body.user.lname,
        fname: req.body.user.fname,
      },
      contentId: content._id,
      content: req.body.content,
    });
    await comment.save();
    const commentResponse = prepareCommentResponse(comment);
    res.status(201).send(commentResponse);
  } else {
    res.status(404);
  }
});


async function prepareCommentResponse(comment,userId) {
  const user = await userModel.findOne({ _id: comment.user._id }).exec();
  if (user) {
    const signedUserPic = user.profilePic
      ? await getSignedURL(user.profilePic)
      : "";
    const commentCount = await commentModel.countDocuments({
      contentId: comment._id,
    });
    const likeCount = await likeModel.countDocuments({
      contentId: comment._id,
    });
    const like = await likeModel.findOne({
      $and: [{userId}, {contentId: comment._id}],
    });
    const commentResponse = {
      comment,
      commentCount,
      likeCount,
      liked: like ? true :false,
      signedUserPic,
    };
    return commentResponse;
  }
}

module.exports = commentRouter;
