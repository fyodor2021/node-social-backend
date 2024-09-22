const mongoose = require("mongoose");
const express = require("express");
const userModel = require("../models/User.js");
const followModel = require("../models/Follow.js");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const connectionRouter = express.Router();
const notiModel = require("../models/Notification.js");
connectionRouter.post("/request", authenticateToken, async (req, res) => {
  if (req.body.sender && req.body.receiverId) {
    const [sender, receiver] = await Promise.all([
      userModel
        .findOne({ _id: req.body.sender._id })
        .select(["_id", "fname", "lname", "email", "following"])
        .exec(),
      userModel
        .findOne({ _id: req.body.receiverId })
        .select(["_id", "fname", "lname", "email", "followers"])
        .exec(),
    ]);
    const fRequest = await followModel
      .findOne({ "sender._id": sender._id, "receiver._id": receiver._id })
      .exec();
    console.log({ fRequest, sender, receiver });
    if (!fRequest && sender && receiver) {
      const follow = new followModel({
        sender: sender,
        receiver: receiver,
      });
      try {
        await follow.save();
        res.status(201).send({ requestId: follow._id });
      } catch (err) {
        res.status(409).send(err);
      }
    } else {
      const notification = await notiModel.findOne({
        "sender._id": sender._id,
        receiverId: receiver._id.toString(),
      });
      try {
        await Promise.all([
          followModel.deleteOne(fRequest),
          notiModel.deleteOne(notification),
        ]);
      } catch (err) {
        res.status(409).send("error deleting resource");
      }

      res.sendStatus(204);
    }
  } else {
    res.status(409).send("need more information");
  }
});
connectionRouter.post("/accept", (req, res) => {});
connectionRouter.post("/decline", (req, res) => {});
connectionRouter.delete("/delete", (req, res) => {});
module.exports = connectionRouter;
