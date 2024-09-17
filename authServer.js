require('dotenv').config();
const express = require('express')
const app = express();
const apiv1 = express();
const authServer = require('./routes/auth.js')
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

//middleware and route definitions;
app.use(cors({  origin: ["http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    'Access-Control-Allow-Headers': 'Authorization',
    credentials: true,}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
apiv1.use('/auth', authServer)
app.use('/api/v1', apiv1)

mongoose.connect(process.env.MONGO_BASE_URL,{
    auth:{
       username: 'root',
       password: 'root'
    }
}).then(console.log('connected'))
.catch(error => console.log(error))

app.listen(3002, () => console.log('auth server listening on port 3002'))