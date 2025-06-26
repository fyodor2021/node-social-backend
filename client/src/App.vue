<script setup>
import NavBar from './components/NavBar.vue';
import { RouterView } from 'vue-router';
import { onMounted, watch } from 'vue';
import SidePanel from './components/SidePanel.vue';
import CreateEditView from './views/CreateEditView.vue';
import { useDisplayStore } from './store/display'
import SearchView from './views/SearchView.vue';
import { useNotiStore } from './store/notifications';
import { useSocketStore } from './store/socket';
import { useAuthStore } from './store/auth';
const displayStore = useDisplayStore();
const notiStore = useNotiStore();
const socketStore = useSocketStore();
const authStore = useAuthStore();
onMounted(async () => {
  if(authStore.loggedIn){
    await notiStore.getNotifications();
    socketStore.setUpUserConnectedListener();
    socketStore.setUpUserDiconnectedListener();
    socketStore.setUpNewMessageAlertListener();
    socketStore.addUserToConnectedUsers();
    socketStore.setUpNewNotificationListener();
    socketStore.setUpDeleteNotificationListener();
  }
})
</script>
<template>
  <NavBar />
  <SidePanel />
  <CreateEditView v-if="displayStore.createView" />
  <SearchView v-if="displayStore.searchView" />
  <RouterView />
</template>