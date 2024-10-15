import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
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
    axios
      .get("/notification/" + authStore._id)
      .then((res) => {
        if (res && res.data) {
          notifications.value = res.data;
        }
      })
      .catch((err) => {});
  }
  return { notifications, notificationsPush, getNotifications };
});
