import "./assets/main.css";
import "primeicons/primeicons.css";
import { createApp, watch } from "vue";
import { createPinia, storeToRefs } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./store/auth";
import { useSocketStore } from "./store/socket";
import axios from "axios";
import ClickOutside from "@/directives/ClickOutside";
import '@vue/compiler-sfc'
axios.defaults.baseURL = "/api/v1";

axios.interceptors.request.use((req) => {
  const authStore = useAuthStore();
  if (authStore.token)
    req.headers.setAuthorization(`Bearer ${authStore.token}`);
  if (authStore._id && req.params && !req.params.userId)
    req.params = { ...req.params, userId: authStore._id };
  req.withCredentials = true;
  return req;
});

axios.interceptors.response.use(
  (res) => {
    const authStore = useAuthStore();
    const socketStore = useSocketStore();
    const { socket } = storeToRefs(socketStore);
    const authHeader = res && res.headers.getAuthorization();
    const authToken = authHeader && authHeader.slice(7);
    if (authToken) {
      authStore.setToken(authToken);
      // socketStore.connectToSocket(authToken)
    }
    return res;
  },
  (e) => {
    const authStore = useAuthStore();
    const resErr = e.response;
    if (resErr && resErr.status === 403 && resErr.data === "unauthenticated") {
      authStore.setToken(null);
      router.push("/login");
    }
    return Promise.reject(e);
    // if (resErr && resErr.status === 404) {
    //   router.push('/error')
    // }
  }
);

const app = createApp(App)
app.use(createPinia());
app.use(router);
app.directive("click-outside", ClickOutside);

async function authStoreInit() {
  const authStore = useAuthStore();
  await authStore.getLoggedUser();
}
async function connectToSocket() {
  const socketStore = useSocketStore();
  const authStore = useAuthStore();
  await socketStore.connectToSocket(authStore.token);
}

(async () => {
  await authStoreInit();
  await connectToSocket();
  app.mount("#app");
})();
