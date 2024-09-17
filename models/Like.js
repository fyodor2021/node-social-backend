const mongoose = require('mongoose');

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

module.exports = mongoose.model('like', likeSchema)