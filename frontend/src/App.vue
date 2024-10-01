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
import { storeToRefs } from 'pinia';
const displayStore = useDisplayStore();
const notiStore = useNotiStore();
const socketStore = useSocketStore();
const { connectedUsers } = storeToRefs(socketStore)
onMounted(async () => {
  await notiStore.getNotifications();
  socketStore.setUpUserConnectedListener();
  socketStore.setUpUserDiconnectedListener();
  socketStore.setUpNewMessageAlertListener();
  socketStore.addUserToConnectedUsers();
  socketStore.setUpNewNotificationListener();
  socketStore.setUpDeleteNotificationListener();
})
watch(connectedUsers.value, (newValue, oldValue) => {
  console.log({ newValue, oldValue })
})

</script>
<template>
  <NavBar />
  <SidePanel />
  <CreateEditView v-if="displayStore.createView" />
  <SearchView v-if="displayStore.searchView" />
  <RouterView />
</template>