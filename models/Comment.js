const mongoose = require("mongoose");

const commentModel = mongoose.Schema({
  user: {
    type: Object,
    require: true,
  },
  contentId: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  modified: {
    type: Boolean,
    default: false
  }
});
module.exports = mongoose.model("comment", commentModel);
