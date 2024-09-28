const commentModel = require("../models/Comment.js");
const postModel = require("../models/Post.js");
const userModel = require("../models/User.js");
const mongoose = require("mongoose");
MONGO_BASE_URL = "mongodb://localhost:27017/social-server";
function generateComment(user, contentId) {
  return new commentModel({
    user: {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
    },
    contentId,
    content: "this is an awesome post",
  });
}
mongoose
  .connect(MONGO_BASE_URL, {
    auth: {
      username: "root",
      password: "root",
    },
  })
  .then(console.log("connected"))
  .catch((error) => console.log(error));

async function getPostsAndCreateComments() {
  const posts = await postModel.find({}).limit(210).exec();
  const users = await userModel.find({}).limit(14).exec();
  if (posts) {
    for (let post of posts) {
      for (let user of users) {
        const comment = generateComment(user, post._id);
        const storedComment = await comment.save();
        for (let user of users) {
          const commentOnComment = generateComment(user, storedComment._id);
          await commentOnComment.save();
        }
      }
    }
    process.exit();
  }
}
getPostsAndCreateComments();
