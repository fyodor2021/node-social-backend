const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');
const userModel = require('../models/User.js');
userRouter.post('/signup', async (req,res) => {
    if(req.body.password === req.body.passwordRetype 
    ){
        const user = new userModel({
            ...req.body
        })
        try{
            await user.save();
        }catch(error){
            res.status(500).send(error)
        }
    }
})

module.exports = userRouter;