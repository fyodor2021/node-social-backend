const express = require("express");
const mongoose = require("mongoose");
const postModel = require("../models/Post.js");
const userModel = require("../models/User.js");
const postRouter = express.Router();
const multer = require("multer");
require("dotenv").config();
const multerGoogle = require("multer-google-storage");
const { getSignedURL, deleteImage } = require("../functions/gcsFunctions.js");
const commentModel = require("../models/Comment.js");
const likeModel = require("../models/Like.js");
const shuffleArray = require("../functions/shuffleArray.js");
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
        strContent: postRequestJson.strContent
          ? postRequestJson.strContent
          : "",
      };
      const post = new postModel(postRequest);
      if (req.file) {
        console.log(req.file);
        post.fileName = req.file.filename;
      }
      await post.save();
      res.sendStatus(201);
    } else {
      res.status(409).send("Please tell us more...");
    }
  }
);
postRouter.post("/share", async (req, res) => {
  const objContent = req.body.objContent;
  console.log(objContent)
  if (req.body.user && objContent && objContent._id && objContent.user && objContent.strContent) {
    const post = postModel.findOne({ _id: objContent._id });
    if (post) {
      const postRequest = new postModel({
        user: req.body.user,
        strContent: req.body.strContent
          ? req.body.strContent
          : "",
        objContent: objContent
      });
      try{
        await postRequest.save();
        res.status(201).send('post was shared')
      }catch(err){
        res.status(409).send(err.toString())
      }
    } else {
      res.status(409).send("can't locate resources to perform operation");
    }
  } else {
    res.status(409).send("information needed to perform process not present");
  }
});
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
    .find({ "user._id": req.query.contentUserId })
    .skip(req.query.offset)
    .limit(3)
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
  console.log(req.query);
  const posts = await postModel
    .find({
      "user._id": { $ne: new mongoose.Types.ObjectId(req.query.userId) },
    })
    .skip(req.query.offset)
    .limit(3)
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
postRouter.put(
  "/",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const postRequestJson = JSON.parse(req.body.post);
    console.log(postRequestJson)
    if (postRequestJson.user && postRequestJson.strContent) {
      const [user, post] = await Promise.all([
        userModel
          .findOne({ _id: postRequestJson.user._id })
          .select(["_id", "fname", "lname", "email"]),
        postModel.findOne({ _id: postRequestJson.postId }),
      ]);
      if (user && post) {
        try {
          const editedPost = await postModel.findByIdAndUpdate(
            post,
            {
              user: {
                _id: user._id.toString(),
                fname: user.fname,
                lname: user.lname,
                email: user.email,
              },
              strContent:
                postRequestJson && postRequestJson.strContent
                  ? postRequestJson.strContent
                  : "",
              fileName:
                req.file && req.file.filename
                  ? req.file.filename
                  : postRequestJson.imageRemoved
                  ? ""
                  : post.fileName,
              moified: true,
            },
            { new: true }
          );
          if (editedPost) {
            if (
              editedPost.fileName !== post.fileName ||
              (postRequestJson.fileName)
            ) {
              await deleteImage(post.fileName);
            }
            const postResponse = await preparePostResponse(editedPost);
            console.log(postResponse);
            res.status(201).send(postResponse);
          } else {
            res.status(200).send("post remained unmodified");
          }
        } catch (err) {
          console.log(err);
          res.status(409).send(err);
        }
      } else {
        res.status(409).send("can't locate resources to perform operation");
      }
    } else {
      res.status(409).send("information needed to perform process not present");
    }
  }
);
postRouter.delete("/", async (req, res) => {
  if (req.query.userId && req.query.postId) {
    const [user, post, comments] = await Promise.all([
      userModel.findOne({ _id: req.query.userId }),
      postModel.findOne({ _id: req.query.postId }),
      commentModel.find({ contentId: req.query.postId }),
    ]);
    if (user && post) {
      try {
        await Promise.all([
          recDeleteComments(comments),
          postModel.deleteOne(post),
          post.fileName ? deleteImage(post.fileName) : "",
        ]);
        res.sendStatus(204);
      } catch (err) {
        res.status(409).send(err.toString());
      }
    } else {
      res.status(409).send("can't locate resources to perform operation");
    }
  } else {
    res.status(409).send("information needed to perform process not present");
  }
});
// async function preparePostNoUser(post, userId) {
//   const [like, commentCount, likeCount, signedPostPic] = await Promise.all([
//     likeModel.findOne({
//       $and: [{ userId }, { contentId: post._id }],
//     }),
//     commentModel.countDocuments({
//       contentId: post._id,
//     }),
//     likeModel.countDocuments({
//       contentId: post._id,
//     }),
//     getSignedURL(post.fileName),
//   ]);
//   post.objContent = post.objContent ? await preparePostResponse(post.objContent) : ''
//   const postResponse = {
//     post,
//     commentCount,
//     likeCount,
//     liked: like ? true : false,
//     signedPostPic,
//   };
//   return postResponse;
// }
async function preparePostResponse(post, userId) {
  const postUser = await userModel.findOne({ _id: post.user._id }).exec();
  if (postUser) {
    const [like, commentCount, likeCount, signedProfilePic, signedPostPic] =
      await Promise.all([
        likeModel.findOne({
          $and: [{ userId }, { contentId: post._id }],
        }),
        commentModel.countDocuments({
          contentId: post._id,
        }),
        likeModel.countDocuments({
          contentId: post._id,
        }),
        postUser.profilePic ? getSignedURL(postUser.profilePic) : "",
        getSignedURL(post.fileName),
      ]);
      post.objContent = post.objContent ? await preparePostResponse(post.objContent) : ''
    const postResponse = {
      object:{
        _id:post._id,
        date: post.date,
        fileName: post.fileName,
        modified: post.modified,
        status: post.status,
        strContent: post.strContent,
        objContent: post.objContent,
        signedPostPic,
        commentCount,
        likeCount,
        liked: like ? true : false,
        user:{
          _id:post.user._id,
          fname:post.user.fname,
          lname:post.user.lname,
          email:post.user.email,
          tag:postUser.tag,
          signedProfilePic
        }
      },
    };
    return postResponse;
  }
}
async function recDeleteComments(comments) {
  if (comments.length === 0) return;
  for (let comment of comments) {
    const storedComment = await commentModel.find({ contentId: comment._id });
    await recDeleteComments(storedComment);
    await commentModel.deleteOne(comment);
  }
}
module.exports = postRouter;
