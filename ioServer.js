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
const expressServer = app.listen(3003, () =>
  console.log("chat server listening on port 3003")
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const Redis = require("redis");
const redisClient = Redis.createClient({ url: "redis://127.0.0.1:6379" });
(async () => {
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
})();

mongoose
  .connect(process.env.MONGO_BASE_URL, {
    auth: {
      username: "root",
      password: "root",
    },
  })
  .then(console.log("connected"))
  .catch((error) => console.log(error));

var io = socketio(expressServer, {
  cors: {
    origin: ["http://localhost:3000"],
    credentials: true,
  },
});
io.use((socket, next) => {
  socketAuthFilter(socket, next);
});
io.on("connection", (socket) => {
  console.log(socket.id)
  socket.on("followCreated", async (data, cb) => {
    console.log(data)
    if (data.sender && data.receiverId) {
      const newNoti = new notiModel({
        sender: data.sender,
        receiverId: data.receiverId,
        requestId: data.requestId,
        type: "request",
      });
      try{
        await newNoti.save();
      }catch(err){
        console.log(err)
      }
      try {
        const receiver = await userModel
          .findOne({ _id: newNoti.receiverId })
          .exec();
        if (receiver.email) {
          const storedSocket = await redisClient.get(
            receiver.email + "Socket"
          );
          // console.log(storedSocket)
          if (storedSocket) {
            cb({
              status: 200,
            });
            await io.to(storedSocket).emitWithAck("notification", newNoti);
          }
        }
      } catch (err) {
        socket.emit("error", "something went wrong");
      }
    }
  });

  socket.on("getNotifications", (data) => {
    console.log(data);
  });


  socket.on("newMessage", async (data) => {
    console.log('im here')
    console.log(data);
    const message = await messageModel
      .findOne({
        $and: [
          { "receiver._id": new mongoose.Types.ObjectId(data.receiverId) },
          { "sender._id": new mongoose.Types.ObjectId(data.senderId) },
        ],
      })
      .sort({ date: -1 });
    const sender = await userModel
      .findOne({ _id: data.senderId })
      .select("email");
    const receiver = await userModel
      .findOne({ _id: data.receiverId })
      .select("email");
    console.log({ sender, receiver });
    const senderSocket = await redisClient.get(sender.email + "Socket");
    const receiverSocket = await redisClient.get(receiver.email + "Socket");
    io.to(senderSocket).to(receiverSocket).emit("message", { message });
  });





  socket.on("disconnect", (socket) => {
    console.log(`socket with ${socket} has disconnected`);
  });




 
});
