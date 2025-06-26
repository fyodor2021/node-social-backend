import express from 'express';
const app = express();
const apiv1 = express();
import mongoose from  'mongoose';
import userRouter from  './routes/users.js';
import searchRouter from  './routes/search.js';
import messageRouter from  './routes/messages.js';
import connectionRouter from  './routes/connections.js';
import bodyParser from  'body-parser';
import postRouter from  './routes/posts.js';
import commentRouter from  './routes/comments.js';
import authRouter from  './routes/auth.js';
import https from  'https';
import fs from  'fs';
import path from  'path';
import cors from  'cors';
import cookieParser from  'cookie-parser';
import notiRouter from  './routes/notifications.js';
import likeRouter from  './routes/likes.js';

//middleware and route definitions;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: process.env.ORIGIN_URL, credentials: true }));

apiv1.use("/user", userRouter);
apiv1.use("/post", postRouter);
apiv1.use("/message", messageRouter);
apiv1.use("/search", searchRouter);
apiv1.use("/comment", commentRouter);
apiv1.use("/connection", connectionRouter);
apiv1.use("/notification", notiRouter);
apiv1.use("/like", likeRouter);
apiv1.use("/auth", authRouter);
app.use(cookieParser());
app.use("/api/v1", apiv1);
app.get('/health', (req,res) => {
  res.sendStatus(200)
})
export {app} ;
