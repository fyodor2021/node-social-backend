import express from "express";
import mongoose from "mongoose";
import notiModel from "../models/Notification.js";
import authenticateToken from "../middleware/tokenAuthFilter.js";

const notiRouter = express.Router();
notiRouter.get("/:id",authenticateToken, async (req, res) => {
  console.log('im in notifications',req.params); 
  const notis = await notiModel
    .find({'receiver._id': req.params.id})
    .limit(5)
    .sort({date: -1})
    .exec();
  res.send(notis)
});

export default  notiRouter;