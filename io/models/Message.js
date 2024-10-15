const mongoose = require('mongoose')


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


module.exports = mongoose.model('message', messageSchema)