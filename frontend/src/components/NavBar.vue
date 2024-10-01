<script setup>
import logo from '@/assets/img/logo.png'
import profilePic from '@/assets/img/profile.png'
import { RouterLink } from 'vue-router';
import router from '@/router'
import { useDisplayStore } from '@/store/display';
import NotificationView from '@/views/NotificationView.vue';
import { useNotiStore } from '@/store/notifications';
import { onMounted, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/store/auth';
import axios from 'axios'
import { useSocketStore } from '@/store/socket';
const displayStore = useDisplayStore();
const notiStore = useNotiStore();
const { notifications } = storeToRefs(notiStore)
const authStore = useAuthStore();
const socketStore = useSocketStore();
const { newMessageAlert } = storeToRefs(socketStore)
const state = reactive({
    newNoti: false
})
const handleNotiClick = () => {
    displayStore.toggleNotiView(3)
    state.newNoti = false
}
const handleLogout = () => {
    axios.delete('http://localhost:3002/api/v1/auth/logout').then(res => {
        if (res && res.status === 200) {
            router.go();
        }
    })
}

watch(notifications, (newValue, oldValue) => {
    state.newNoti = true
}, { deep: true })

watch(newMessageAlert, (newValue, oldValue) => {
    if (/chat/.test(window.location.href)) {
        socketStore.newMessageAlert = false
    }
}, { deep: true })
onMounted(() => {
    console.log(router.currentRoute.value.path)
})
</script>
<template>
    <div class="n-b-container">
        <div v-if="authStore.token" class="wrapper">
            <div class="profile-pic-container"
                @click="router.push({ name: 'userDetails', params: { userId: authStore._id } })">
                <img :src="authStore.signedProfilePic ? authStore.signedProfilePic : profilePic">
            </div>
            <div class="flex">

                <i @click="() => displayStore.toggleCreateView()" class="pi pi-plus w-12 text-3xl m-2"></i>

                <i @click="() => router.push('/')" :class="`pi pi-home ${router.currentRoute.value.path === '/' ? 'text-gray-400' : ''} w-12 text-3xl m-2`"></i>

                <i @click="() => displayStore.toggleSearchView()"
                    class="pi pi-search w-12 text-3xl m-2 2xl:hidden "></i>

                <div class="relative" v-click-outside="() => displayStore.notiView = false">

                    <i :class="`pi pi-bell ${displayStore.notiView ? 'text-gray-400' : ''} w-12 text-3xl m-2 relative`" @click="handleNotiClick"></i>

                    <div class="notification-panel">
                        <NotificationView v-if="displayStore.notiView" />
                    </div>

                    <span v-if="state.newNoti" class="bg-red-500 rounded absolute w-2 h-2 top-0 right-4"></span>
                </div>

                <span class="relative">
                    <RouterLink to="/chat" @click="() => socketStore.newMessageAlert = false"
                        :class="`pi pi-send w-12 text-3xl m-2 cursor-pointer ${router.currentRoute.value.path === '/chat' ? 'text-gray-400' : ''}`"></RouterLink>
                    <span v-if="socketStore.newMessageAlert"
                        class="bg-red-500 rounded absolute w-2 h-2 top-2 right-4"></span>
                </span>
                <div class="relative" v-click-outside="() => displayStore.navOptionList = false">
                    <i :class="`pi pi-ellipsis-v ${displayStore.navOptionList ? 'text-gray-400' : ''} w-12 text-3xl m-2 cursor-pointer relative`"
                        @click="() => displayStore.toggleNavOptionList()"></i>
                    <div v-if="displayStore.navOptionList" class="options-container">
                        <div class="triangle ml-4 mr-4"></div>
                        <div class="options-wrapper">
                            <div @click="handleLogout" class="options-item w-full p-2  cursor-pointer">
                                Logout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="wrapper">
            <div>
                <RouterLink aria-current="page" class="flex items-center" to="/">
                    <img :src="logo" class="rounded-full w-10 h-10">
                </RouterLink>
            </div>
            <div class="flex items-center justify-end gap-3">
                <RouterLink
                    class="hidden items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-gray-50 sm:inline-flex"
                    to="/register">Sign in</RouterLink>
                <RouterLink
                    class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    to="/login">Login</RouterLink>
            </div>
        </div>
    </div>
</template>
<style scoped>
.wrapper {
    position: fixed;
    left: 0;
    right: 0;
    top: 1rem;
    z-index: 30;
    width: 50%;
    min-width: 800px;
    min-height: 90px;
    margin: 0 auto;
    max-width: 100vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e5e7eb;
    background-color: rgba(252, 252, 252, 0.8);
    padding: 0.5rem 0.5rem;
    border-radius: .25rem;
    box-shadow: 0 0 6px 0px #0000003d;
}

.options-container {
    position: fixed;
    display: flex;
    flex-direction: column;
    width: 13vw;
}

.options-wrapper {
    width: 100%;
    background-color: white;
    padding: .5rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    box-shadow: 0px 0px 7px 7px #00000033;
    outline: 1px solid rgba(0, 0, 0, 0.322);
    border-radius: 1rem;
}

.options-item {
    width: 100%;
    background-color: rgb(255, 255, 255);
    font-size: 1.25rem;
    font-weight: bold;
    border-radius: .5rem;
    display: flex;
    height: 100%;
}

.options-item :hover {
    background-color: rgb(197, 197, 197);
    border-radius: .5rem;

}


.notification-panel {
    position: fixed;

}

@media only screen and (max-width: 1200px) {
    .wrapper {
        margin: 0 !important;
        width: 100% !important;
        border-radius: 0 !important;
    }

    .options-container {
        align-items: flex-end;
        right: 1.5em;
    }
    .notification-panel{
        right: 9.8em

    }


}

@media only screen and (max-width: 1000px) {
    .n-b-container {
        width: 100% !important;
        margin: 0 !important;
    }

}
</style>