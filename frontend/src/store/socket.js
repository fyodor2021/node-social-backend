import { defineStore } from "pinia";
import { ref } from "vue";
import { io } from "socket.io-client";
import { useNotiStore } from "./notifications";

export const useSocketStore = defineStore("socket", () => {
  const socket = ref(null);
  const connectedUsers = ref(new Set());
  const newMessageAlert = ref(false)
  const newMessageAlertSet = ref(new Set());
  const notiStore = useNotiStore();
  function setSocket(value) {
    socket.value = value;
  }
  async function connectToSocket(token) {
    try{
      setSocket(
        io({
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
          pingInterval: 2000,
          pingTimeout: 5000,
        })
      );
    }catch(err){
      console.log(err.toString())
    }
    }
  function toggleNewMessageAlert() {
    newMessageAlert.value = false;
  }
  function setUpInitialConnectionBundleEmitter(userList){
    socket.value.emit("onUserConnectBundle", userList);
    socket.value.on('connectionBundle', userList => {
      for(let userId of userList){
        connectedUsers.value.add(userId)
      }
    })
  }
  function setUpUserConnectedListener() {
    socket.value.on("connected", (userId) => {
      connectedUsers.value.add(userId);
    });
  }
  function setUpUserDiconnectedListener() {
    socket.value.on("userDisconnected", (userId) => {
      if (connectedUsers.value.has(userId)) {
        connectedUsers.value.delete(userId);
      }
    });
  }
  function setUpNewMessageAlertListener() {
    socket.value.on("newMessageAlert", ({userId}) => {
      if (connectedUsers.value.has(userId)) {
        newMessageAlertSet.value.add(userId);
        newMessageAlert.value = true
      }
    });
  }
  function addUserToConnectedUsers(userId) {
    connectedUsers.value.add(userId);
  }
  function setUpNewNotificationListener(){
    socket.value.on("notification", data => {
      if (data) {
        notiStore.notificationsPush(data)
      }
    });
  }
  function setUpDeleteNotificationListener(){
    socket.value.on("deleteNotification", data => {
      if(data){
        for(let [index,noti] of notiStore.notifications.entries()){
          if(noti._id === data._id){
            notiStore.notifications.splice(index, 1)
          }
        }
      }
    });
  }
  return { socket, 
    connectedUsers,
    newMessageAlert,
    newMessageAlertSet,
    setSocket,
    connectToSocket, 
    toggleNewMessageAlert,
    setUpUserConnectedListener,
    setUpUserDiconnectedListener,
    setUpNewMessageAlertListener,
    setUpInitialConnectionBundleEmitter,
    addUserToConnectedUsers,
    setUpNewNotificationListener,
    setUpDeleteNotificationListener
  };
});
