const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    fname: {
        type: String,
        require: true,
        trim: true,
        lowercase:true,
        maxlength: 10,
        minlength: 3
    },
    lname:{
        type: String,
        require: true,
        trim: true,
        lowercase:true,
        maxlength: 10,
        minlength: 3
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        unique: true,
        minlength: 3,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        require: true,
        trim: true,
    },
    passwordRetype:{
        type: String,
        trim:true,
        require: true,
    },
    tag: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    profilePic: {
        type: String,
    },
    backgroundPic: {
        type: String,
    }

})

module.exports = mongoose.model('user', userSchema)