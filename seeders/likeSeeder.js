const mongoose = require('mongoose');
const commentModel = require('../models/Comment.js')
const postModel = require('../models/Post.js')
const userModel = require('../models/User.js')
const likeModel = require('../models/Like.js')
MONGO_BASE_URL = "mongodb://localhost:27017/social-server";

mongoose
  .connect(MONGO_BASE_URL, {
    auth: {
      username: "root",
      password: "root",
    },
  })
  .then(() => console.log("connected"))
  .catch((error) => console.log(error));


(async () => {
    const users = await userModel.find({}).exec();
    const posts = await postModel.find({}).exec();
    const comments = await commentModel.find({}).exec();
    const contents = [...posts, ...comments]

    console.log(contents.length)
    for(let content of contents){
        for(let user of users){
            const like = new likeModel({
                userId: user._id,
                contentId: content._id
            })
            await like.save();
        }   
    }
    process.exit();

})()

