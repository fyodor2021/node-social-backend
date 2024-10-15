const mongoose = require('mongoose');

const followSchema = mongoose.Schema({
    sender: {
        type: Object,
        require: true,
    },
    receiver:{
        type: Object,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        trim: true,
        default: 'pending'
    }
})

module.exports = mongoose.model('follow', followSchema)