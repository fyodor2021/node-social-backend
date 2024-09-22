const express = require("express");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const messageModel = require("../models/Message.js");
const userModel = require("../models/User.js");
const mongoose = require("mongoose");
const { getSignedURL } = require("../functions/gcsFunctions.js");
const messageRouter = express.Router();

messageRouter.post("/", authenticateToken, async (req, res) => {
  if (req.body) {
    const sender = await userModel
      .findOne({ _id: req.body.sender._id })
      .select(["_id", "fname", "lname"]);
    const receiver = await userModel
      .findOne({ _id: req.body.receiver._id })
      .select(["_id", "fname", "lname"]);
    if (sender && receiver) {
      const message = new messageModel({
        sender,
        receiver,
        content: req.body.content,
      });
      try {
        message.save();
        res.sendStatus(201);
      } catch (err) {
        res.sendStatus(409);
      }
    } else {
      res.sendStatus(409);
    }
  } else {
    res.status(409).send("please type something");
  }
});
messageRouter.get("/", async (req, res) => {
  console.log(req.query);
  const chats = await messageModel
    .find({
      $or: [
        {
          $and: [
            { "receiver._id": new mongoose.Types.ObjectId(req.query.userId) },
            {
              "sender._id": new mongoose.Types.ObjectId(
                req.query.selectedUserId
              ),
            },
          ],
        },
        {
          $and: [
            {
              "receiver._id": new mongoose.Types.ObjectId(
                req.query.selectedUserId
              ),
            },
            { "sender._id": new mongoose.Types.ObjectId(req.query.userId) },
          ],
        },
      ],
    })
    .sort({ date: 1 })
    .exec();
  res.status(200).send(chats);
});
messageRouter.get("/convo", authenticateToken, async (req, res) => {
  const openConvos = new Set();
  const myConvos = await messageModel
    .find({ "receiver._id": new mongoose.Types.ObjectId(req.query.userId) })
    .distinct("sender._id");
  if (myConvos.length > 0) {
    for (let convo of myConvos) {
      openConvos.add(convo.toString());
    }
  }
  const theirConvos = await messageModel
    .find({ "sender._id": new mongoose.Types.ObjectId(req.query.userId) })
    .distinct("receiver._id")
    .exec();
  if (theirConvos.length > 0) {
    for (let convo of theirConvos) {
      openConvos.add(convo.toString());
    }
  }
  const userResponse = [];
  for (let userId of openConvos) {
    const user = await userModel.findOne({ _id: userId }).exec();
    if (user) {
      let { _id, fname, lname, profilePic, tag } = user;
      profilePic = await getSignedURL(user.profilePic);
      userResponse.push({ _id, fname, lname, signedProfilePic: profilePic, tag });
    }
  }
  res.status(200).send(userResponse);
});
module.exports = messageRouter;
