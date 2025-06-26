import mongoose from "mongoose";



const messageSchema = mongoose.Schema({
    sender: {
        type: Object,
        require: true,
    },    
    receiver: {
        type: Object,
        require: true,
    },
    content: {
        type: String,
    },
    content: {
        type: Object
    },
    date: {
        type: Date,
        default: Date.now
    }
})


export default mongoose.model('message', messageSchema)