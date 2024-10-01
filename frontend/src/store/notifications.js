import { defineStore } from "pinia";
import { ref } from "vue";
import axios from 'axios'
import { useAuthStore } from "./auth";

export const useNotiStore = defineStore("notifications", () => {
  const authStore = useAuthStore();
  const notifications = ref(null);

  function notificationsPush(value) {
      if (!notifications.value.includes(value) && value) {
        notifications.value.push(value);
      }
  }
  async function getNotifications() {
  try{
      const res = await axios.get('/notification/' + authStore._id)
      if(res && res.data){
        console.log(res.data)
        notifications.value = res.data
      }
  }  catch(err){
    console.log(err)
  }  
  }
  return { notifications, notificationsPush, getNotifications };
});
