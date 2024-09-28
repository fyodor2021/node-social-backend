const express = require("express");
const authRouter = express.Router();
require("dotenv").config();
const userModel = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/tokenAuthFilter.js");
const Redis = require("redis");
const {getSignedURL} = require("../functions/gcsFunctions.js");
const redisClient = Redis.createClient({ url: "redis://127.0.0.1:6379" });
(async () => {
  await redisClient.connect();
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
})();

authRouter.post("/login", async (req, res) => {
  if (!req.headers.authorization && !req.cookies.RF_) {
    if (req.body == null)
      return res.status(409).send("Please fill the required fields.");
    try {
      const criterias = {
        email: req.body.email,
      };
      const storedUser = await userModel.findOne(criterias).exec();
      if (storedUser === null) return res.status(403).send("Cannot find User");
      else {
        if (await bcrypt.compare(req.body.password, storedUser.password)) {
          const { _id, fname, lname, email,profilePic  } = storedUser;
          const token = jwt.sign(
            { _id, fname, lname, email },
            process.env.JWT_SECRET,
            { expiresIn: "15s" }
          );
          const refreshToken = jwt.sign(
            { _id, fname, lname, email },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "1d" }
          );
          const storedToken = await redisClient.get(email + "RefreshToken");
          if (!storedToken) {
            redisClient.setEx(
              email + "RefreshToken",
              86400 * 1000,
              refreshToken
            );
          } else {
            await redisClient.del(email + "RefreshToken");
            redisClient.setEx(
              email + "RefreshToken",
              86400 * 1000,
              refreshToken
            );
          }
          res.cookie("RT_", refreshToken, {
            maxAge: 86400 * 1000,
            httpOnly: true,
            path: "/",
          });
          const signedProfilePic = storedUser && storedUser.profilePic
           ?  await getSignedURL(storedUser.profilePic) 
           : ''
          // const signedProfilePic = profilePic ?  await getSignedURL(profilePic) : ''
          return res.json({ token: token, user: { _id, fname, lname, email, signedProfilePic } });
        } else {
          res.status(403).send("Cannot find User");
        }
      }
    } catch (error) {
      console.log(error);
      res.status(403).send(error);

    }
  }else{
    res.sendStatus(204)
  }
});
authRouter.delete("/logout", (req, res) => {
res.clearCookie('RT_')
res.sendStatus(200)
});



authRouter.get("/user", authenticateToken, (req, res) => {
  const authHeader = res.getHeaders().authorization
  const token = authHeader && authHeader.slice(7);
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) res.status(403).send("unauthenticated");
      const storedUser = await userModel.findOne({_id: user._id})
      const signedProfilePic = storedUser && storedUser.profilePic
       ?  await getSignedURL(storedUser.profilePic) 
       : ''

      const userResponse = {
        user:{
          _id: user._id,
          fname: user.fname,
          lname: user.lname,
          email: user.email,
          signedProfilePic
        },
        token
      };
      res.status(200).send(userResponse);
    });
  }else{
    res.send('not token for you')
  }

});

module.exports = authRouter;
