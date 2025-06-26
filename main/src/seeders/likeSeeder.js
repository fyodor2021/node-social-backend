import postModel from '../models/Post.js';
import userModel from '../models/User.js';
import likeModel from '../models/Like.js';

export const createLikes = async () => {
  const users = await userModel.find({}).exec();
  const posts = await postModel.find({}).exec();
  for (let post of posts) {
    for (let user of users) {
      if (user.email !== 'vedoorbbs@gmail.com') {
        const like = new likeModel({
          userId: user._id,
          contentId: post._id,
        });
        await like.save();
      }
    }
  }
};
