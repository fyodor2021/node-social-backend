import commentModel from "../models/Comment.js";
import postModel from "../models/Post.js";
import userModel from "../models/User.js";

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


export async function createComments() {
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
  }
}
