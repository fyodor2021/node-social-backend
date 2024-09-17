const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/User.js");
const cookie = require("cookie");
const Redis = require("redis");
const redisClient = Redis.createClient({ url: "redis://127.0.0.1:6379" });
(async () => {
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
})();
function socketAuthFilter(socket, next) {
  const authHeader = socket.handshake.headers.authorization;
  const token = authHeader && authHeader.slice(7);
  const RT_ =
    socket.handshake.headers.cookie &&
    cookie.parse(socket.handshake.headers.cookie).RT_;
  if (!token) {
    if (RT_) {
      validateRefreshToken(RT_, socket, next);
    } else {
      console.log(token);
      socket.disconnect(true);
    }
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        if (RT_) {
          validateRefreshToken(RT_, socket, next);
        } else {
          socket.disconnect(true);
        }
      } else {
        storeSocket(socket, user, next);
      }
    });
  }
}
const validateRefreshToken = (refToken, socket, next) => {
  jwt.verify(refToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
    if (err) {
      switch (err.name) {
        case "TokenExpiredError":
          return socket.disconnect(true);
      }
    } else {
      storeSocket(socket, user, next);
    }
  });
};

async function storeSocket(socket, user, next) {
  const storedSocket = await redisClient.get(user.email + "Socket");
  if (storedSocket) {
    redisClient.del(user.email + "Socket");
    redisClient.setEx(user.email + "Socket", 960000, socket.id);
    next();
  } else {
    redisClient.setEx(user.email + "Socket", 960000, socket.id);
    next();
  }
}
module.exports = socketAuthFilter;
