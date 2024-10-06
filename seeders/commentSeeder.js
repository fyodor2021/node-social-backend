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
        const firstLayercomment = generateComment(user, post._id);
        const storedFirestLayerComment = await firstLayercomment.save();
        for (let user of users) {
          const secondLayerComment = generateComment(user, storedFirestLayerComment._id);
          const storedSecondLayerComment = await secondLayerComment.save();
          for (let user of users) {
            const thirdLayerComment = generateComment(user, storedSecondLayerComment._id);
             await thirdLayerComment.save();
          }
        }
      }
    }
    process.exit();
  }
}
getPostsAndCreateComments();
