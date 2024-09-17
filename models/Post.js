const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: {
        type: Object,
        require: true,
    },
    content:{
        type: String,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        trim: true,
        default: 'public'
    },
    fileNames: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('post', postSchema)