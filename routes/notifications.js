const express = require("express");
const mongoose = require("mongoose");
const notiModel = require("../models/Notification.js");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const notiRouter = express.Router();

notiRouter.get("/:id",authenticateToken, async (req, res) => {
  console.log(req.params); 
  const notis = await notiModel
    .find({receiverId: req.params.id})
    .limit(5)
    .sort({date: -1})
    .exec();
  res.send(notis)
});

module.exports = notiRouter;