import {
  createRouter,
  createWebHistory,
} from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import MessageView from "@/views/ChatView.vue";
import PageNotFound from "@/components/PageNotFound.vue";
import PostDetailsView from "@/views/PostDetailsView.vue";
import UserDetailsView from "@/views/UserDetailsView.vue";
import { useAuthStore } from "@/store/auth";
import { storeToRefs } from "pinia";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/chat",
      name: "messages",
      component: MessageView,
    },
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/:pathmatch(.*)*",
      name: "not-found",
      component: PageNotFound,
    },
    {
      path: "/post/details/:postId",
      name: "postDetails",
      component: PostDetailsView,
      props: true,
    },
    {
      path: "/user/details/:userId",
      name: "userDetails",
      component: UserDetailsView,
      props: true,
    },
  ],
});
// router.beforeEach(async (to, from, next) => {
//   const authStore = useAuthStore(); // Initialize auth store
//   const { _id } = storeToRefs(authStore); // Destructure store refs
//   if (_id && (to.name == "login" || to.name == "register")) {
//     next("/");
//   } else {
//     next(); // Proceed to the requested route
//   }
// });
export default router;
