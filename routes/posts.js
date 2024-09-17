const express = require("express");
const mongoose = require("mongoose");
const postModel = require("../models/Post.js");
const userModel = require("../models/User.js");
const postRouter = express.Router();
const multer = require("multer");
require("dotenv").config();
const multerGoogle = require("multer-google-storage");
const getSignedURL = require("../functions/getSignedURL.js");
const commentModel = require("../models/Comment.js");
const likeModel = require("../models/Like.js");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const upload = multer({
  storage: multerGoogle.storageEngine({
    autoRetry: true,
    acl: {},
    projectId: process.env.PROJECT_ID,
    bucket: process.env.BUCKET_NAME,
    keyFilename: process.env.KEY_FILE_NAME,
    filename: (req, file, cb) => {
      const fileNewName = Date.now() + "-" + file.originalname;
      cb(null, fileNewName);
    },
  }),
});

postRouter.post(
  "/",
  [authenticateToken, upload.single("image")],
  async (req, res) => {
    if (req.body) {
      const postRequestJson = JSON.parse(req.body.post);
      const postRequest = {
        user: {
          _id: postRequestJson.user._id,
          fname: postRequestJson.user.fname,
          lname: postRequestJson.user.lname,
          email: postRequestJson.user.email,
        },
        content: postRequestJson.content ? postRequestJson.content : "",
      };
      const post = new postModel(postRequest);
      if (req.file) {
        post.fileNames.push(req.file.filename);
      }
      await post.save();
      res.sendStatus(201);
    } else {
      res.status(409).send("Please tell us more...");
    }
  }
);


postRouter.get("/id", async (req, res) => {
  const post = await postModel.findOne({ _id: req.query.postId }).exec();
  if (post) {
    const postResponse = await preparePostResponse(post, req.query.userId);
    if (postResponse) {
      return res.status(200).send(postResponse);
    } else {
      return res.sendStatus(404);
    }
  } else {
    return res.sendStatus(404);
  }
});

postRouter.get("/user/id/", authenticateToken, async (req, res) => {
  const posts = await postModel
    .find({ "user._id": new mongoose.Types.ObjectId(req.query.userId) })
    .skip(req.query.offset)
    .limit(4)
    .exec();
  const postResponse = [];
  if (posts) {
    for (let post of posts) {
      postResponse.push(await preparePostResponse(post, req.query.userId));
    }
    return res.status(200).send(postResponse);
  } else {
    return res.sendStatus(404);
  }
});




postRouter.get("/", authenticateToken, async (req, res) => {
  console.log(req.query)
  const posts = await postModel
    .find({})
    .skip(req.query.offset)
    .limit(4)
    // .sort({date: -1})
    .exec();
  const postResponse = [];
  if (posts) {
    for (let post of posts) {
      postResponse.push(await preparePostResponse(post, req.query.userId));
    }
    res.status(200).send(postResponse);
  } else {
    res.sendStatus(404);
  }
});






async function preparePostResponse(post, userId) {
  const postUser = await userModel.findOne({ _id: post.user._id }).exec();
  if (postUser) {
    const signedPostPic = await getSignedURL(post.fileNames[0]);
    const signedUserPic = postUser.profilePic
      ? await getSignedURL(postUser.profilePic)
      : "";
    const commentCount = await commentModel.countDocuments({
      contentId: post._id,
    });
    const likeCount = await likeModel.countDocuments({
      contentId: post._id,
    });

    // console.log({userId}, {contentId: post._id})
    const like = await likeModel.findOne({
      $and: [{userId}, {contentId: post._id}],
    });
    const postResponse = {
      post,
      commentCount,
      likeCount,
      liked: like ? true : false,
      signedPostPic,
      signedUserPic,
    };
    return postResponse;
  }
}
module.exports = postRouter;
