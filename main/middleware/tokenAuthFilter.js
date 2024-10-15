const jwt = require("jsonwebtoken");
require("dotenv").config();
const userModel = require("../models/User.js");
const Redis = require("redis");
const redisClient = Redis.createClient({url: process.env.REDIS_HOST});
(async () => {
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
})();
async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.slice(7);
  if (!token) {
    if (req.cookies.RT_) {
      validateRefreshToken(req, res, next);
    } else {
      res.status(403).send("unauthenticated");
    }
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        switch (err.name) {
          case "TokenExpiredError":
            if (req.cookies.RT_) {
              validateRefreshToken(req, res, next);
            } else {
              res.status(403).send("unauthenticated");
            }
        }
      } else {
        const storedUser = await userModel.findOne({ _id: user._id }).exec();
        if (storedUser) {
          next();
        } else {
          res.clearCookie("RT_");
          res.status(403).send("unauthenticated");
        }
      }
    });
  }
}
const validateRefreshToken = (req, res, next) => {
  const refToken = req.cookies.RT_;
  jwt.verify(refToken, process.env.JWT_REFRESH_SECRET, async (err, user) => {
    const storedToken = await redisClient.get(user.email + "RefreshToken");
    if (storedToken && storedToken === refToken) {
      if (err) {
        switch (err.name) {
          case "TokenExpiredError":
            res.clearCookie("RT_");
            next();
        }
      } else {
        const storedUser = await userModel.findOne({ _id: user._id }).exec();
        if (storedUser) {
          const { _id, fname, lname, email } = user;
          const newAccessToken = jwt.sign(
            { _id, fname, lname, email },
            process.env.JWT_SECRET,
            { expiresIn: "15s" }
          );
          res.set("Authorization", `Bearer ${newAccessToken}`);
          next();
        } else {
          res.clearCookie("RT_");
          res.status(403).send("unauthenticated");
        }
      }
    } else {
      if (!req.cookies.RT_) {
        res.status(403).send("unauthenticated");
      } else {
        res.clearCookie("RT_");
        next();
      }
    }
  });
};

module.exports = authenticateToken;
