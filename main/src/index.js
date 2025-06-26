import mongoose from 'mongoose';
import { redisWrapper } from './redis-wrapper.js';
import { app } from './app.js';
import { seedUsersAndSave } from './seeders/userSeeder.js';
import { createPosts } from './seeders/postSeeder.js';
import userModel from './models/User.js';
import {createLikes} from './seeders/likeSeeder.js'
import {createComments} from './seeders/commentSeeder.js'

const start = async () => {
  setTimeout(() => {}, 2000);
  console.log('strating.....');
  if (!process.env.MONGO_BASE_URL)
    throw new Error('MONGO_BASE_URL not defined');
  if (!process.env.REDIS_URL) throw new Error('REDIS_URL not defined');
  if (!process.env.PROJECT_ID) throw new Error('PROJECT_ID not defined');
  if (!process.env.BUCKET_NAME) throw new Error('BUCKET_NAME not defined');
  if (!process.env.KEY_FILE_NAME) throw new Error('KEY_FILE_NAME not defined');
  mongoose
    .connect(process.env.MONGO_BASE_URL)
    .then(() => {
      console.log('connected to mongo, index.js');
      runSeeders();
    })
    .catch((err) => console.log(err));

  redisWrapper
    .connect(process.env.REDIS_URL)
    .then(() => {
      console.log('connected to redis, index.js');
    })
    .catch((err) => console.log(err));
  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
};

const runSeeders = async () => {
  const user = await userModel.findOne({});
  if (!user) {
    seedUsersAndSave().then((res) => {
      createPosts().then(() => {
        createLikes();
        createComments()
      })
    }) 


  }
};

start()

