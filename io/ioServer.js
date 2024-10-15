const express = require("express");
const socketio = require("socket.io");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const socketAuthFilter = require("./middleware/socketAuthFilter.js");
const bodyParser = require("body-parser");
const userModel = require("./models/User.js");
const notiModel = require("./models/Notification.js");
const messageModel = require("./models/Message.js");
const followModel = require("./models/Follow.js");
const https = require("https");
const fs = require("fs");
const path = require("path");
const Redis = require("redis");
const { getSignedURL } = require("./functions/gcsFunctions.js");

const redisClient = Redis.createClient({
  password: process.env.REDIS_PWD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
(async () => {
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
})();

// const httpsServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
//   },
//   app
// );

const server = app.listen(3002, () => console.log("ioserver started 3002"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_BASE_URL, {
    auth: {
      username: "root",
      password: "root",
    },
  })
  .then(console.log("connected"))
  .catch((error) => console.log(error));
try {
  var io = socketio(server, {
    cors: {
      origin: process.env.ORIGIN_URL,
      credentials: true,
    },
  });
} catch (err) {
  console.log(err);
}
io.use((socket, next) => {
  socketAuthFilter(socket, next);
});

io.on("connection", (socket) => {
  console.log("\n NEW CONNECTION.", socket.id);

  socket.broadcast.emit("connected", socket.user._id);

  socket.on("userListOnlineStatusCheck", async (userList) => {
    let onlineUsers = [];
    for (let userId of userList) {
      const user = await userModel.findOne({ _id: userId }).select("email");
      if (user.email) {
        const userSocket = await redisClient.get(user.email + "Socket");
        if (userSocket) {
          onlineUsers.push(user._id);
        }
      }
    }
    io.to(socket.id).emit("userListOnlineStatus", onlineUsers);
  });
  socket.on("userOnlineStatusCheck", async (userId, cb) => {
    console.log(userId);
    const user = await userModel.findOne({ _id: userId }).select("email");
    if (user.email) {
      const userSocket = await redisClient.get(user.email + "Socket");
      if (userSocket) {
        cb({
          status: 200,
        });
      }
    }
  });
  socket.on("followCreated", async (data) => {
    console.log(data.sender, data.receiver);
    if (data.sender && data.receiver) {
      const fRequest = await followModel.findOne({
        "sender._id": new mongoose.Types.ObjectId(data.receiver._id),
        "receiver._id": new mongoose.Types.ObjectId(data.sender._id),
      });
      const newNoti = new notiModel({
        sender: data.sender,
        receiver: data.receiver,
        content: "Started following you!",
        type: fRequest ? "request-accepted" : "request",
      });
      const receiver = await userModel.findOne({ _id: newNoti.receiver._id });
      const storedSocket = await redisClient.get(receiver.email + "Socket");
      try {
        await newNoti.save();
        if (storedSocket) {
          io.to(storedSocket).emit("notification", newNoti);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
  socket.on("followDeleted", async (data) => {
    if (data.senderId && data.receiverId) {
      const [storedNoti, receiver] = await Promise.all([
        notiModel.findOne({
          $and: [
            { "sender._id": data.senderId },
            { "receiver._id": data.receiverId },
          ],
        }),
        userModel.findOne({ _id: data.receiverId }).select(["email"]),
      ]);
      const storedSocket = await redisClient.get(receiver.email + "Socket");
      try {
        if (storedSocket) {
          io.to(storedSocket).emit("deleteNotification", storedNoti);
          await notiModel.deleteOne(storedNoti);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
  socket.on("getNotifications", (data) => {
    console.log(data);
  });

  socket.on("newMessage", async (data, cb) => {
    const [message, sender, receiver] = await Promise.all([
      messageModel
        .findOne({
          $and: [
            { "receiver._id": new mongoose.Types.ObjectId(data.receiverId) },
            { "sender._id": new mongoose.Types.ObjectId(data.senderId) },
          ],
        })
        .sort({ date: -1 }),
      userModel.findOne({ _id: data.senderId }).select(["email", "profilePic"]),
      userModel.findOne({ _id: data.receiverId }).select("email"),
    ]);
    const senderSocket = await redisClient.get(sender.email + "Socket");
    const receiverSocket = await redisClient.get(receiver.email + "Socket");
    if (typeof message.content === "object") {
      message.content.user.signedProfilePic = message.content.user
        .signedProfilePic
        ? await getSignedURL(message.content.user.signedProfilePic)
        : "";
      message.content.signedPostPic = message.content.fileName
        ? await getSignedURL(message.content.fileName)
        : "";
    }
    io.to(senderSocket).to(receiverSocket).emit("message", { message });
    io.to(receiverSocket).emit("newMessageAlert", { userId: socket.user._id });
  });

  socket.on("disconnect", () => {
    redisClient.del(socket.user.email + "Socket");
    socket.broadcast.emit("userDisconnected", socket.user._id);
  });
});
