const express = require("express");
const app = express();
const apiv1 = express();
const mongoose = require("mongoose");
const userRouter = require("./routes/users.js");
const searchRouter = require("./routes/search.js");
const messageRouter = require("./routes/messages.js");
const connectionRouter = require("./routes/connections.js");
const bodyParser = require("body-parser");
const postRouter = require("./routes/posts.js");
const commentRouter = require("./routes/comments.js");
const authRouter = require("./routes/auth.js");
require("dotenv").config();
const https = require("https");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const notiRouter = require("./routes/notifications.js");
const likeRouter = require("./routes/likes.js");


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

//connections;
mongoose
  .connect(process.env.MONGO_BASE_URL, {
    auth: {
      username: "root",
      password: "root",
    },
  })
  .then(console.log("connected"))
  .catch((error) => console.log(error));

// const httpsServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
//   },
//   app
// );

app.listen(3001, () => console.log("server started 3001"));
