const express = require('express')
const app = express();
const apiv1 = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users.js');
const bodyParser = require('body-parser');
const cors = require('cors')
const BASE_URL = 'mongodb://localhost:27017/social-server'





//middleware and route definitions;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
apiv1.use('/user', userRouter)
app.use('/api/v1', apiv1)






//connections;
mongoose.connect(BASE_URL,{
     auth:{
        username: 'root',
        password: 'root'
     }
}).then(console.log('connected'))
.catch(error => console.log(error))
app.listen(3001, () =>{
    console.log('lisening on 3001')
})
