const express = require("express");
const userRouter = express.Router();
const userModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { getSignedURL, deleteImage } = require("../functions/gcsFunctions.js");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const followModel = require("../models/Follow.js");
const postModel = require("../models/Post.js");
const multerGoogle = require("multer-google-storage");
require("dotenv").config();
const multer = require("multer");

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

userRouter.post("/signup", async (req, res) => {
  if (
    req.body.fname &&
    req.body.lname &&
    req.body.email &&
    req.body.password &&
    req.body.passwordRetype
  ) {
    if (req.body.password === req.body.passwordRetype) {
      const password = await bcrypt.hash(req.body.password, 10);
      const user = new userModel({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: password,
      });
      try {
        await user.save();
        res.status(201).send("User created successfully");
      } catch (error) {
        if (error.code === 11000) {
          res.status(409).send("user already exists");
        }
      }
    } else {
      res.status(409).send("Passwords entered don't match");
    }
  } else {
    res.status(409).send("Please fill the required fields.");
  }
});
userRouter.get("/suggestions", authenticateToken, async (req, res) => {
  const users = await userModel.find({}).limit(8).skip(req.query.offset).exec();
  const userResponse = [];
  for (let user of users) {
    let { _id, fname, lname, profilePic, tag } = user;
    profilePic = await getSignedURL(user.profilePic);
    userResponse.push({ _id, fname, lname, signedProfilePic: profilePic, tag });
  }
  res.status(200).send(userResponse);
});
userRouter.get("/id", async (req, res) => {
  if (req.query.visitedUserId) {
    const visitedObjectId = new mongoose.Types.ObjectId(
      req.query.visitedUserId
    );
    const [user, following, followers, postCount] = await Promise.all([
      userModel.findOne({ _id: visitedObjectId }).exec(),
      followModel.find({ "sender._id": visitedObjectId }),
      followModel.find({ "receiver._id": visitedObjectId }),
      postModel.countDocuments({ "user._id": req.query.visitedUserId }),
    ]);
    if (user) {
      let followedByLoggedUser = false;
      if (req.query.userId) {
        for (let follower of followers) {
          if (follower.sender._id.toString() === req.query.userId) {
            followedByLoggedUser = true;
            break;
          }
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
        followedByLoggedUser: followedByLoggedUser,
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

userRouter.put(
  "/profile/pic",
  [authenticateToken, upload.single("image")],
  async (req, res) => {
    const userRequestJson = JSON.parse(req.body.data);
    if (userRequestJson.userId) {
      const user = await userModel.findOne({ _id: userRequestJson.userId });
      if (user) {
        try {
          if (user.profilePic || userRequestJson.imageRemoved) {
            await deleteImage(user.profilePic);
          }
          userModel
            .findByIdAndUpdate(
              user,
              {
                profilePic:
                  req.file && req.file.filename ? req.file.filename : "",
              },
              { returnOriginal: false }
            )
            .then(async (response) => {
              const sigendProfilePic = await getSignedURL(response.profilePic);
              res.status(201).json(sigendProfilePic);
            });
        } catch (err) {
          userModel.findByIdAndUpdate(user, {
            profilePic: "",
          });
          res.status(409).send("error occured while performing operation");
        }
      } else {
        res.status(409).send("user not found");
      }
    } else {
      res.status(409).send("information needed to perform process not present");
    }
  }
);
module.exports = userRouter;
