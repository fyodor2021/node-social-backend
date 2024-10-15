const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: {
        type: Object,
        require: true,
    },
    strContent:{
        type: String,
        require: true,
    },
    objContent:{
        type: Object,
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
    fileName: {
        type: String,
        default: ''
    },
    modified: {
        type: Boolean, 
        default: false,
    }
})

module.exports = mongoose.model('post', postSchema)