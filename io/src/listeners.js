import mongoose from 'mongoose';

import userModel from './models/User.js';
import notiModel from './models/Notification.js';
import messageModel from './models/Message.js';
import followModel from './models/Follow.js';
import { getSignedURL } from './functions/gcsFunctions.js';
import {ioWrapper} from './io-wrapper.js'
import { redisWrapper } from './redis-wrapper.js';


export const registedListeners = (io) => {
io.on('connection', (socket) => {
  const redisClient = redisWrapper.client;
  console.log('\n NEW CONNECTION.', socket.id);

  socket.broadcast.emit('connected', socket.user._id);

  socket.on('userListOnlineStatusCheck', async (userList) => {
    let onlineUsers = [];
    for (let userId of userList) {
      const user = await userModel.findOne({ _id: userId }).select('email');
      if (user.email) {
        const userSocket = await redisClient.get(user.email + 'Socket');
        if (userSocket) {
          onlineUsers.push(user._id);
        }
      }
    }
    io.to(socket.id).emit('userListOnlineStatus', onlineUsers);
  });
  socket.on('userOnlineStatusCheck', async (userId, cb) => {

    const user = await userModel.findOne({ _id: userId }).select('email');
    if (user && user.email) {
      const userSocket = await redisClient.get(user.email + 'Socket');
      if (userSocket) {
        cb({
          status: 200,
        });
      }
    }
  });
  socket.on('followCreated', async (data) => {
    if (data.sender && data.receiver) {
      const fRequest = await followModel.findOne({
        'sender._id': new mongoose.Types.ObjectId(data.receiver._id),
        'receiver._id': new mongoose.Types.ObjectId(data.sender._id),
      });
      const newNoti = new notiModel({
        sender: data.sender,
        receiver: data.receiver,
        content: 'Started following you!',
        type: fRequest ? 'request-accepted' : 'request',
      });
      const receiver = await userModel.findOne({ _id: newNoti.receiver._id });
      const storedSocket = await redisClient.get(receiver.email + 'Socket');
      try {
        await newNoti.save();
        if (storedSocket) {
          io.to(storedSocket).emit('notification', newNoti);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
  socket.on('followDeleted', async (data) => {
    if (data.senderId && data.receiverId) {
      const [storedNoti, receiver] = await Promise.all([
        notiModel.findOne({
          $and: [
            { 'sender._id': data.senderId },
            { 'receiver._id': data.receiverId },
          ],
        }),
        userModel.findOne({ _id: data.receiverId }).select(['email']),
      ]);
      const storedSocket = await redisClient.get(receiver.email + 'Socket');
      try {
        if (storedSocket) {
          io.to(storedSocket).emit('deleteNotification', storedNoti);
          await notiModel.deleteOne(storedNoti);
        }
      } catch (err) {
        console.log(err);
      }
    }
  });
  socket.on('getNotifications', (data) => {
  });

  socket.on('newMessage', async (data, cb) => {
    const [message, sender, receiver] = await Promise.all([
      messageModel
        .findOne({
          $and: [
            { 'receiver._id': new mongoose.Types.ObjectId(data.receiverId) },
            { 'sender._id': new mongoose.Types.ObjectId(data.senderId) },
          ],
        })
        .sort({ date: -1 }),
      userModel.findOne({ _id: data.senderId }).select(['email', 'profilePic']),
      userModel.findOne({ _id: data.receiverId }).select('email'),
    ]);
    console.log(message, sender, receiver)
    const senderSocket = await redisClient.get(sender.email + 'Socket');
    const receiverSocket = await redisClient.get(receiver.email + 'Socket');
    if (typeof message.content === 'object') {
      message.content.user.signedProfilePic = message.content.user
        .signedProfilePic
        ? await getSignedURL(message.content.user.signedProfilePic)
        : '';
      message.content.signedPostPic = message.content.fileName
        ? await getSignedURL(message.content.fileName)
        : '';
    }
    io.to(senderSocket).to(receiverSocket).emit('message', { message });
    io.to(receiverSocket).emit('newMessageAlert', { userId: socket.user._id });
  });

  socket.on('disconnect', () => {
    redisClient.del(socket.user.email + 'Socket');
    socket.broadcast.emit('userDisconnected', socket.user._id);
  });
});

}
