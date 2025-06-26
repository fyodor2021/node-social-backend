import mongoose from 'mongoose';
import { redisWrapper } from './redis-wrapper.js';
import { app } from './app.js';
import { ioWrapper } from './io-wrapper.js';
import socketAuthFilter from './middleware/socketAuthFilter.js'
import {registedListeners} from './listeners.js'

const start = async () => {
  setTimeout(() => {}, 2000);
  console.log('strating.....');
  if (!process.env.REDIS_HOST) throw new Error('REDIS_HOST not defined');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI not defined');
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('connected to mongo, index.js');
    })
    .catch((err) => console.log(err));

  redisWrapper
    .connect(process.env.REDIS_HOST)
    .then(() => {
      console.log('connected to redis, index.js');
    })
    .catch((err) => console.log(err));
  const server = app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
  await ioWrapper.connect(server, {
    cors: {
      origin: process.env.ORIGIN_URL,
      credentials: true,
    },
  });
  ioWrapper.io.use((socket, next) => {
    socketAuthFilter(socket, next);
  });
  registedListeners(ioWrapper.io);
};

start();
