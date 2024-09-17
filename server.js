const express = require('express')
const app = express();
const apiv1 = express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users.js');
const searchRouter = require('./routes/search.js');
const messageRouter = require('./routes/messages.js')
const connectionRouter = require('./routes/connections.js')
const bodyParser = require('body-parser');
const postRouter = require('./routes/posts.js')
const commentRouter = require('./routes/comments.js')
require('dotenv').config();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const notiRouter = require('./routes/notifications.js');
const Redis = require("redis");
const likeRouter = require('./routes/likes.js');
const authenticateToken = require('./middleware/tokenAuthFilter.js');
const redisClient = Redis.createClient({url: 'redis://127.0.0.1:6379'});
(async () => {
  await redisClient.connect()
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
})();


//middleware and route definitions;
app.use(bodyParser.urlencoded({extended: true,

}));
app.use(bodyParser.json());
app.use(cors({  origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true,}));
apiv1.use('/user', userRouter)
apiv1.use('/post', postRouter)
apiv1.use('/message', messageRouter)
apiv1.use('/search', searchRouter)
apiv1.use('/comment', commentRouter)
apiv1.use('/connection', connectionRouter)
apiv1.use('/notification', notiRouter)
apiv1.use('/like', likeRouter)
app.use(cookieParser());
app.use('/api/v1', apiv1)


//connections;
mongoose.connect(process.env.MONGO_BASE_URL,{
     auth:{
        username: 'root',
        password: 'root'
     }
}).then(console.log('connected'))
.catch(error => console.log(error))
app.listen(3001, () =>{
    console.log('node server lisening on 3001')
})
