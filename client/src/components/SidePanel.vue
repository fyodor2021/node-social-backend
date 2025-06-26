<script setup>
import companyLogo from '../assets/img/company-logo.png'
import { useDisplayStore } from '@/store/display';
import { reactive, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import ContentUser from './ContentUser.vue';
import { useSocketStore } from '@/store/socket';
import { storeToRefs } from 'pinia';
import { useNotiStore } from '@/store/notifications';
import NotificationView from '@/views/NotificationView.vue';
import { useWindowSize } from '@vueuse/core';
import axios from 'axios'
import router from '@/router';
import LogoutIcon from '~icons/solar/logout-2-linear'
import LoginIcon from '~icons/solar/login-2-linear'
import RegisterIcon from '~icons/mdi/registered-trademark'
import logo from '@/assets/img/logo.png'
const authStore = useAuthStore();
const displayStore = useDisplayStore();
const socketStore = useSocketStore()
const { newMessageAlert } = storeToRefs(socketStore)
const notiStore = useNotiStore();
const { notifications } = storeToRefs(notiStore)

const { width} = useWindowSize();
defineProps({
    isChat: {
        type: Boolean,
        default: false
    }
})
const state = reactive({
    newNoti: false,
    screenWidth: width.value,
    showNotifications: displayStore.notiView
})
const handleToggleCreate = () => {
    displayStore.toggleCreateView()
}
const handleToggleSearch = () => {
    displayStore.toggleSearchView()
}
watch(notifications, () => {
    state.newNoti = true
}, { deep: true })
watch(newMessageAlert, () => {
    if (/chat/.test(window.location.href)) {
        socketStore.newMessageAlert = false
    }
}, { deep: true })

const handleNotiClick = () => {
    state.showNotifications = !state.showNotifications

}
const handleLogout = () => {
    axios.delete('/auth/logout').then(res => {
        if (res && res.status === 200) {
            router.go();
        }
    }).catch((err) => {})
}

watch(width, (newWidth, oldWidth) => {
    state.screenWidth = newWidth
})

</script>
<template>
    <div v-if="displayStore.sidePanel" :class="`s-p-container ${isChat ? 'relative' : ''} xl:hidden`">
        <div v-if="state.screenWidth > 1550" class="w-[350px]"></div>

        <div :class="`wrapper`">
            <div v-if="state.showNotifications || state.screenWidth < 1550"
                class="w-[70px] h-[170px] flex justify-center items-center">
                <img :src="logo" />
            </div>
            <div v-else>
                <img :src="companyLogo" alt="company logo" class="w-[300px] h-[170px]">
            </div>
            <div v-if="authStore._id" class="max-w-[250px]">
                <RouterLink to="/" class="item text-2xl"><i class="pi pi-home"></i>{{ !state.showNotifications &&
                    state.screenWidth > 1550 ? 'Home' :
                    '' }}</RouterLink>
                <div @click="handleToggleCreate" class="item text-2xl cursor-pointer"><i class="pi pi-plus"></i>{{
                    !state.showNotifications && state.screenWidth > 1550 ? 'Create' : '' }}
                </div>
                <div @click="handleToggleSearch" class="item text-2xl cursor-pointer"><i class="pi pi-search"></i>{{
                    !state.showNotifications && state.screenWidth > 1550 ? 'Search' : '' }}
                </div>
                <div class="relative flex" v-click-outside="() => state.showNotifications = false">
                    <div class="item text-2xl cursor-pointer" @click="handleNotiClick">
                        <i class="pi pi-bell"></i>
                        {{ !state.showNotifications && state.screenWidth > 1550 ? 'Notifications' : '' }}
                    </div>
                    <span v-if="state.newNoti"
                        :class="`bg-red-500 rounded absolute w-2 h-2 top-2 ${!state.showNotifications ? 'right-2' : 'right-auto'}`">
                    </span>
                    <div :class="[
                        'fixed top-0 left-[4rem] max-h-[100vh] transition-transform duration-800 bg-black p-2',
                        state.showNotifications ? 'translate-x-0' : '-translate-x-[30rem]'
                    ]">
                        <NotificationView :isPanel="true" />
                    </div>
                </div>
                <div class="relative">
                    <RouterLink to="/chat" @click="() => socketStore.newMessageAlert = false" class="item text-2xl"><i
                            class="pi pi-send"></i>{{ !state.showNotifications && state.screenWidth > 1550 ? 'Messages'
                                : '' }}</RouterLink>
                    <span v-if="socketStore.newMessageAlert"
                        :class="`bg-red-500 rounded absolute w-2 h-2 top-2 ${!state.showNotifications ? 'right-8' : 'right-auto'}`"></span>
                </div>
                <div v-if="authStore._id" class="item text-2xl cursor-pointer" @click="handleLogout">
                    <LogoutIcon />
                    {{ !state.showNotifications && state.screenWidth > 1550 ? 'Logout' : '' }}
                </div>

            </div>
            <div v-else class="flex items-center flex-col ">
                <RouterLink to="/" class="item text-2xl"><i class="pi pi-home"></i>{{ !state.showNotifications &&
                    state.screenWidth > 1550 ? 'Home' :
                    '' }}</RouterLink>
                <RouterLink to="/login" class="item text-2xl">
                    <LoginIcon class="ml-[10px] text-2xl" />
                    {{ !state.showNotifications && state.screenWidth > 1550 ? 'Login' : '' }}

                </RouterLink>
                <RouterLink to="/register" class="item text-2xl">
                    <RegisterIcon />
                    {{ !state.showNotifications && state.screenWidth > 1550 ? 'Register' : '' }}
                </RouterLink>
            </div>
            <div v-if="authStore._id" :class="` text-white text-sm flex w-fit justify-between items-center 
                        ${state.showNotifications || state.screenWidth < 1550 ? 'flex-col' : ''}`">
                <ContentUser :hideName="state.showNotifications || state.screenWidth < 1550 ? true : false" />
            </div>
            <div v-else class="h-[79px]"></div>
        </div>
    </div>

</template>
<style scoped>
.s-p-container {
    min-height: 100vh;
    position: fixed;
    top: 0;
    background-color: black;
    width: fit-content;
    z-index: 99;
}

.wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 1.5rem;
}

.company-logo-side {
    max-width: 300px;
}

.item {
    color: white;
    display: flex;
    width: fit-content;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.item>* {
    margin: 15px;
}
</style>
