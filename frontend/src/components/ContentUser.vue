<script setup>
import capName from '@/functions/capName';
import profile from '@/assets/img/profile.png'
import { useAuthStore } from '@/store/auth';
import router from '@/router';
const authStore = useAuthStore();
const props = defineProps({
    user: {
        required: false
    },
    signedProfilePic: {
        type: String,
    },
    contentDate: {
        type: String,
    },
    selected: {
        type: Boolean,
        default: false
    },
    displayTracker: {
        type: Boolean,
        default: false
    },
    isChatView: {
        type: Boolean,
        default: false
    }
    , isOnline: {
        type: Boolean,
        default: false
    },
    newMessage: {
        type: Boolean,
        default: false
    }
})
const handleUserClick = () => {
    if (!props.isChatView)
        router.push({ name: 'userDetails', params: { userId: props.user._id } })
}
</script>
<template>
    <div @click="handleUserClick"
        :class="`flex items-center  justify-between cursor-pointer p-2 ${selected ? 'bg-black' : ''}`">
        <div v-if="user" class="flex items-start cursor-pointer ">
            <div class="profile-pic-container">
                <img v-if="signedProfilePic" :src="signedProfilePic ? signedProfilePic : profile" :alt="user.fname"
                    rel="preload" />
                <img v-else :src="profile" alt="sara" class="w-20" rel="preload" />
            </div>
            <div>
                <h1 :class="`font-bold ${selected ? 'text-white' : ''}`"> {{ capName(user.fname) }} {{
                    capName(user.lname) }}</h1>
                <h2 :class="`text-gray-700 ${selected ? 'text-gray-600' : ''}`">{{ user.tag ? '@' + user.tag : '' }}
                </h2>
                {{ contentDate ? new Date(contentDate).toLocaleString() : '' }}

            </div>
            <span v-if="isOnline" class="w-2 h-2 bg-green-500 rounded-full m-4"></span>
            <span v-if="newMessage" class="w-2 h-2 bg-orange-500 rounded-full m-4"></span>
        </div>
        <div @click="() => router.push({ name: 'userDetails', params: { userId: authStore._id } })" v-else
            class="flex items-center">
            <div class="profile-pic-container w-28 h-28">
                <img :src="authStore.signedProfilePic ? authStore.signedProfilePic : profile" alt="sara" />
            </div>
            <h1 v-if="authStore.fname || authStore.lname" class="font-bold"> {{ capName(authStore.fname) }} {{
                capName(authStore.lname) }}</h1>
        </div>

    </div>

</template>

<style></style>