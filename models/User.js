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
        minlength: 3,
        maxlength: 16
    },
    passwordRetype:{
        type: String,
        trim:true,
        require: true,
        minlength: 3,
        maxlength: 16
    }
})

module.exports = mongoose.model('user', userSchema)