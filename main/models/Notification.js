const mongoose = require('mongoose');

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

module.exports = mongoose.model('notification', notiSchema)