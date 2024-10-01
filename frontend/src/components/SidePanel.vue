<script setup>
import companyLogo from '../assets/img/company-logo.png'
import profile from '../assets/img/profile.png'
import { useDisplayStore } from '@/store/display';
import { onUnmounted, defineProps } from 'vue';
import { useAuthStore } from '@/store/auth';

const authStore = useAuthStore();
const displayStore = useDisplayStore();
const handleToggleCreate = () => {
    displayStore.toggleCreateView()
}
const handleToggleSearch = () => {
    displayStore.toggleSearchView()
}
</script>
<template>
    <div v-if="displayStore.sidePanel" class="s-p-container">
        <div class="wrapper">
            <div>
                <img class="company-logo-side" :src="companyLogo" alt="company logo">
            </div>
            <div>
                <RouterLink to="/" class="item text-2xl"><i class="pi pi-home"></i>Home</RouterLink>
                <div @click="handleToggleCreate" class="item text-2xl cursor-pointer"><i
                        class="pi pi-plus"></i>Create</div>
                <div @click="handleToggleSearch" class="item text-2xl cursor-pointer"><i
                        class="pi pi-search"></i>Search</div>
                <div class="item text-2xl"><i class="pi pi-bell"></i>Notifications</div>
                <RouterLink to="/chat" class="item text-2xl"><i class="pi pi-send"></i>Messages</RouterLink>
            </div>
        </div>
    </div>

</template>
<style scoped>
.s-p-container {
    min-height: 100vh;
    position: fixed;
    top: 0;
    z-index: 9999;
    background-color: black;
    width: 23%;
}

.wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
}

.company-logo-side {
    max-width: 20vw;
}

.item {
    color: white;
    margin: 2rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.item>* {
    margin: 15px;
}
@media only screen and (max-width: 1520px) {
  .s-p-container {
    display: none;
  }

}
</style>