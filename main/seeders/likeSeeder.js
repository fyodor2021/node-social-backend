const mongoose = require('mongoose');
const commentModel = require('../models/Comment.js')
const postModel = require('../models/Post.js')
const userModel = require('../models/User.js')
const likeModel = require('../models/Like.js')
require('dotenv').config({path:'../.env'})


mongoose
  .connect(process.env.MONGO_BASE_URL, {
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
    for(let post of posts){
        for(let user of users){
          if(user.email !== 'vedoorbbs@gmail.com'){
            const like = new likeModel({
                userId: user._id,
                contentId: post._id
            })
            await like.save();
          }
        }   
    }
    process.exit();

})()

