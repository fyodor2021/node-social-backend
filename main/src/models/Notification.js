import mongoose from "mongoose";


const notiSchema = mongoose.Schema({
    sender: {
        type: Object,
        require: true,
    },
    receiver:{
        type:Object,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    content:{
        type: String,
        required: true
    },
    type: {
        type: String,
        trim: true,
        default: 'system'
    }
})

export default mongoose.model('notification', notiSchema)