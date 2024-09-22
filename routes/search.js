const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/User.js");
const {getSignedURL} = require("../functions/gcsFunctions.js");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const searchRouter = express.Router();
searchRouter.get("/:term",authenticateToken, async (req, res) => {
  console.log(req.params);
  const users = await userModel
    .find({
      $or: [
        { fname: { $regex: req.params.term } },
        { lname: { $regex: req.params.term } },
        { tag: { $regex: req.params.term } },
      ],
    })
    .limit()
    .exec();
  const userResponse = [];
  for (let user of users) {
    let { _id, fname, lname, profilePic, tag } = user;
    profilePic = await getSignedURL(user.profilePic)
    userResponse.push({ _id,fname, lname, signedProfilePic:profilePic, tag });
  }
  res.status(200).send(userResponse);
});

module.exports = searchRouter;
