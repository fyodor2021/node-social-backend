require('dotenv').config();
const express = require('express')
const app = express();
const apiv1 = express();
const authServer = require('./routes/auth.js')
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const https = require('https')
const fs = require('fs')
const path = require('path')
//middleware and route definitions;

app.use(cors({  origin: process.env.ORIGIN_URL,
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

const httpsServer = https.createServer({
    key:fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
    cert:fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem')),
  
  } , app)
  
  
  httpsServer.listen(3002, () => console.log('authserver started 3002'))
  