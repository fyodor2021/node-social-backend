const mongoose = require("mongoose");
const express = require("express");
const userModel = require("../models/User.js");
const followModel = require("../models/Follow.js");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const connectionRouter = express.Router();
const notiModel = require("../models/Notification.js");

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
      console.log({sender,receiver, fRequest})
    if (!fRequest && sender && receiver) {
      const follow = new followModel({
        sender: sender,
        receiver: receiver,
      });
      try {
        await follow.save();
        await updateNotification(receiver,sender);
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
const updateNotification = async ( sender, receiver) => {
  console.log(sender, receiver)
  const storedNoti = await notiModel.findOne({
    $and: [
      { "sender._id": sender._id.toString() },
      { 'receiver._id': receiver._id.toString() },
    ],
  });
  if(storedNoti){
    await notiModel.findByIdAndUpdate(
      storedNoti,
      {
        type: "request-accepted",
      },
      {returnOriginal: false}
    ).then(res => {
      return res
    })
  }else{
    console.log('i found nothing')
  }
};
module.exports = connectionRouter;
