const mongoose = require('mongoose');

const notiSchema = mongoose.Schema({
    sender: {
        type: Object,
        require: true,
    },
    receiverId:{
        type:String,
        require: true,
    },
    requestId:{
        type:String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        trim: true,
        default: 'system'
    }
})

module.exports = mongoose.model('notification', notiSchema)