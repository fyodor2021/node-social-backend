<script setup>
import { useNotiStore } from '@/store/notifications';
import Notification from '@/components/Notification.vue';
import { useDisplayStore } from '@/store/display';
const notiStore = useNotiStore();
const displayStore = useDisplayStore();
</script>
<template>
    <div class="n-v-container">
        <div class="triangle ml-3 mr-3"></div>
        <div class="list-container"
            v-if="notiStore.notifications.length > 0">
            <Notification v-for="notification in notiStore.notifications" :key="notification._id"
                :notification="notification" />
        </div>
        <div v-else class="list-container bg-white p-4 text-xl">
            All's calm in the galaxy.
        </div>
    </div>
</template>
<style scoped>
.n-v-container {
    display: flex;
    flex-direction: column;
    position: fixed;
    margin-left: .55rem
    
}

.list-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 7px 7px #00000033;
    outline: 1px solid rgba(0, 0, 0, 0.205);
    background-color: rgb(233, 233, 233);
    border-radius: .5rem;
    padding: 1rem;

}

</style>