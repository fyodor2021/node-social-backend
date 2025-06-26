import mongoose from "mongoose";
import express from "express";
import userModel from "../models/User.js";
import followModel from "../models/Follow.js";
import authenticateToken from "../middleware/tokenAuthFilter.js";
import notiModel from "../models/Notification.js";
import { getSignedURL } from "../functions/gcsFunctions.js";

const connectionRouter = express.Router();
connectionRouter.post("/request", authenticateToken, async (req, res) => {
  if (req.body.sender && req.body.receiver) {
    const [sender, receiver] = await Promise.all([
      userModel
        .findOne({ _id: req.body.sender._id })
        .select(["_id", "fname", "lname", "email"])
        .exec(),
      userModel
        .findOne({ _id: req.body.receiver._id })
        .select(["_id", "fname", "lname", "email"])
        .exec(),
    ]);
    const fRequest = await followModel
      .findOne({ "sender._id": sender._id, "receiver._id": receiver._id })
      .exec();
    console.log({ sender, receiver, fRequest });
    if (!fRequest && sender && receiver) {
      const follow = new followModel({
        sender: sender,
        receiver: receiver,
      });
      try {
        await follow.save();
        await updateNotification(receiver, sender);
        res.sendStatus(201);
      } catch (err) {
        console.log(err);
        res.status(409).send(err.toString());
      }
    } else {
      res
        .status(409)
        .send("can't location the needed resources to preform operation");
    }
  } else {
    res.status(409).send("invalid request, i need more information");
  }
});
connectionRouter.get("/followers", async (req, res) => {
  if (req.query.userId) {
    const monObjId = new mongoose.Types.ObjectId(req.query.visitedUserId);
    const userList = await followModel
      .find({ "receiver._id": monObjId })
      .select("sender");
    const userResponses = [];
    if (userList) {
      for (let user of userList) {
        const storedUser = await userModel
          .findOne({ _id: user.sender._id })
          .select(["email", "fname", "lname", "tag", "profilePic"]);
        if (storedUser) {
          const signedProfilePic = await getSignedURL(storedUser.profilePic);
          const { _id, email, fname, lname, tag } = storedUser;
          userResponses.push({
            signedProfilePic,
            _id,
            email,
            fname,
            lname,
            tag,
          });
        }
      }
      console.log(userResponses);
      res.status(201).send(userResponses);
    }
  }
});
connectionRouter.get("/following", async (req, res) => {
  if (req.query.userId) {
    const monObjId = new mongoose.Types.ObjectId(req.query.visitedUserId);
    const userList = await followModel
      .find({ "sender._id": monObjId })
      .select("receiver");
    const userResponses = [];
    if (userList) {
      for (let user of userList) {
        const storedUser = await userModel
          .findOne({ _id: user.receiver._id })
          .select(["email", "fname", "lname", "tag", "profilePic"]);
        if (storedUser) {
          const signedProfilePic = await getSignedURL(storedUser.profilePic);
          const { _id, email, fname, lname, tag } = storedUser;
          userResponses.push({
            signedProfilePic,
            _id,
            email,
            fname,
            lname,
            tag,
          });
        }
      }
      res.status(201).send(userResponses);
    }
  }
});
connectionRouter.delete("/", async (req, res) => {
  const senderId = req.query && req.query.userId;
  const receiverId = req.query && req.query.receiverId;
  if (senderId && receiverId) {
    const [sender, receiver] = await Promise.all([
      userModel.findOne({ _id: senderId }).select(["fname", "lname", "email"]),
      userModel
        .findOne({ _id: receiverId })
        .select(["fname", "lname", "email"]),
    ]);
    if (sender && receiver) {
      const request = await followModel.findOne({
        $and: [{ sender: sender }, { receiver: receiver }],
      });
      if (request) {
        followModel.deleteOne(request).then((result) => {
          if (result.deletedCount === 1) {
            res.sendStatus(204);
          }
        });
      }
    }
  }
});
const updateNotification = async (sender, receiver) => {
  console.log(sender, receiver);
  const storedNoti = await notiModel.findOne({
    $and: [
      { "sender._id": sender._id.toString() },
      { "receiver._id": receiver._id.toString() },
    ],
  });
  if (storedNoti) {
    await notiModel
      .findByIdAndUpdate(
        storedNoti,
        {
          type: "request-accepted",
        },
        { returnOriginal: false }
      )
      .then((res) => {
        return res;
      });
  } else {
    console.log("i found nothing");
  }
};
export default  connectionRouter;
