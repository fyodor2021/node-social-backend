import mongoose from "mongoose";


const likeSchema = mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },    
    contentId: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
   
})

export default mongoose.model('like', likeSchema)