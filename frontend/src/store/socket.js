import { defineStore } from "pinia";
import { ref } from "vue";
import { io } from "socket.io-client";

export const useSocketStore = defineStore("socket", () => {
  const socket = ref(null);
  const connectedUsers = ref(new Set());
  const newMessageAlert = ref(false)
  const newMessageAlertSet = ref(new Set());
  function setSocket(value) {
    socket.value = value;
  }
  async function connectToSocket(token) {
    await setSocket(
      io("http://localhost:3003", {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
        pingInterval: 2000,
        pingTimeout: 5000,
      })
    );
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
    addUserToConnectedUsers
  };
});
