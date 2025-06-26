import express from "express";
import mongoose from "mongoose";
import postModel from "../models/Post.js";
import userModel from "../models/User.js";
import commentModel from "../models/Comment.js";
import authenticateToken from "../middleware/tokenAuthFilter.js";
import { getSignedURL } from "../functions/gcsFunctions.js";
import likeModel from "../models/Like.js";

const commentRouter = express.Router();
commentRouter.get("/", async (req, res) => {
  const comments = await commentModel
    .find({ contentId: req.query.contentId })
    .skip(req.query.offset)
    .limit(8)
    .sort({ date: -1 })
    .exec();
  const commentResponse = [];
  if (comments) {
    for (let comment of comments) {
      commentResponse.push(
        await prepareCommentResponse(comment, req.query.userId)
      );
    }
    res.status(200).send(commentResponse);
  } else {
    res.sendStatus(204);
  }
});

commentRouter.get("/id", authenticateToken, async (req, res) => {
  const comments = await commentModel
    .find({ contentId: req.query.commentId })
    .limit(3)
    .skip(req.query.offset)
    .sort({ date: -1 })
    .exec();
  const commentResponse = [];
  if (comments) {
    for (let comment of comments) {
      commentResponse.push(
        await prepareCommentResponse(comment, req.query.userId)
      );
    }
    res.status(201).send(commentResponse);
  } else {
    res.sendStatus(204);
  }
});

commentRouter.post("/", authenticateToken, async (req, res) => {
  let content = await postModel.findOne({ _id: req.body.contentId });
  if (!content) {
    content = await commentModel.findOne({ _id: req.body.contentId });
  }
  if (content) {
    const comment = new commentModel({
      user: {
        _id: req.body.user._id,
        lname: req.body.user.lname,
        fname: req.body.user.fname,
      },
      contentId: content._id,
      content: req.body.content,
    });
    await comment.save();
    const commentResponse = await prepareCommentResponse(comment);
    console.log(commentResponse);
    res.status(201).send(commentResponse);
  } else {
    res.status(404);
  }
});
commentRouter.put("/", authenticateToken, async (req, res) => {
  if (req.body.user && req.body.content) {
    const [user, comment] = await Promise.all([
      userModel
        .findOne({ _id: req.body.user._id })
        .select(["_id", "fname", "lname", "email"]),
      commentModel.findOne({ _id: req.body.commentId }),
    ]);
    if (user && comment) {
      console.log("this is the comment", comment);
      try {
        const editedComment = await commentModel.findByIdAndUpdate(
          comment,
          {
            user: {
              _id: user._id,
              fname: user.fname,
              lname: user.lname,
            },
            contentId: comment.contentId,
            content: req.body && req.body.content ? req.body.content : "",
            modified: true,
          },
          { new: true }
        );
        if (editedComment) {
          const commentResponse = await prepareCommentResponse(editedComment);
          console.log(
            "this is the comment response with the edited comment",
            commentResponse
          );
          res.status(201).send(commentResponse);
        } else {
          res.status(200).send("comment remained unmodified");
        }
      } catch (err) {
        console.log(err);
        res.status(409).send(err);
      }
    } else {
      res.status(409).send("can't locate resources to perform operation");
    }
  } else {
    res.status(409).send("information needed to perform process not present");
  }
});
commentRouter.delete("/", async (req, res) => {
  if (req.query.userId && req.query.commentId) {
    const commentCount = await commentModel.countDocuments({});
    console.log(commentCount);
    const [user, comment, comments] = await Promise.all([
      userModel.findOne({ _id: req.query.userId }),
      commentModel.findOne({ _id: req.query.commentId }),
      commentModel.find({ contentId: req.query.commentId }),
    ]);
    console.log(
      "this is the comment you want to delete,",
      comment._id.toString()
    );
    for (let comment of comments) {
      console.log(
        "this is an id on the comment you wanted to delete",
        comment.contentId
      );
    }
    if (user && comment) {
      try {
        await Promise.all([
          recDeleteComments(comments),
          commentModel.deleteOne(comment),
        ]);
        const commentCount = await commentModel.countDocuments({});
        console.log(commentCount);
        res.sendStatus(204);
      } catch (err) {
        res.status(409).send(err.toString());
      }
    } else {
      res.status(409).send("can't locate resources to perform operation");
    }
  } else {
    res.status(409).send("information needed to perform process not present");
  }
});
async function prepareCommentResponse(comment, userId) {
  const user = await userModel.findOne({ _id: comment.user._id }).exec();
  if (user) {
    const [like, commentCount, likeCount, signedProfilePic] = await Promise.all(
      [
        likeModel.findOne({
          $and: [{ userId }, { contentId: comment._id }],
        }),
        commentModel.countDocuments({
          contentId: comment._id,
        }),
        likeModel.countDocuments({
          contentId: comment._id,
        }),
        user.profilePic ? getSignedURL(user.profilePic) : "",
      ]
    );
    const commentResponse = {
      
        content: comment.content,
        contentId: comment.contentId,
        date: comment.date,
        modified: comment.modified,
        _id: comment._id,
        commentCount,
        likeCount,
        liked: like ? true : false,
          
      user: {
        _id: comment.user._id,
        fname: comment.user.fname,
        lname: comment.user.lname,
        signedProfilePic,
      },
    };
    return commentResponse;
  }
}
async function recDeleteComments(comments) {
  if (comments.length === 0) return;
  for (let comment of comments) {
    const storedComment = await commentModel.find({ contentId: comment._id });
    await recDeleteComments(storedComment);
    await commentModel.deleteOne(comment);
  }
}
export default  commentRouter;
