import mongoose from 'mongoose';


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
export default mongoose.model("comment", commentModel);
