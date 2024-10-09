<script setup>
import capName from '@/functions/capName';
import profile from '@/assets/img/profile.png'
import { useAuthStore } from '@/store/auth';
import router from '@/router';
import ProfilePicEdit from './ProfilePicEdit.vue';
const authStore = useAuthStore();
const props = defineProps({
    user: {
        required: false
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
    ,isOnline: {
        type: Boolean,
        default: false
    },
    newMessage: {
        type: Boolean,
        default: false
    },
    isComment: {
        type:Boolean,
        default: false
    },
    isPost: {
        type:Boolean,
        default: false
    },
})
const handleUserClick = () => {
    if (!props.isChatView){
        if(props.user){
            router.push({ name: 'userDetails', params: { userId: props.user._id } })
        }else{
            router.push({ name: 'userDetails', params: { userId: authStore._id } })
        }
    }
}
</script>
<template>
    <div @click="handleUserClick"
        :class="`flex h-full items-center justify-between cursor-pointer  ${selected ? 'bg-black' : ''}`">
        <div v-if="user" :class="`flex h-full items-center cursor-pointer justify-center px-1`">
            <div :class="`profile-pic-container ${isComment ? 'w-8 h-8 mr-[6px]' : ''} ${isPost ? 'w-12 h-12 mr-[6px]' : ''}`">
                <img :src="user.signedProfilePic ? user.signedProfilePic : profile" :alt="user.fname"
                    rel="preload" />
            </div>
            <div :class="`${isComment ? 'text-[.75rem]' : ''}  ${ isPost ? 'h-full flex flex-col justify-start items-start' : ''}`">
                <h1 :class="`font-bold ${selected ? 'text-white' : ''}`">
                     {{ capName(user.fname) }} {{capName(user.lname) }}
                    </h1>
                <h2 :class="`text-gray-700 text-[.85rem] ${selected ? 'text-gray-600' : ''}`">
                    {{ user.tag ? '@' + user.tag : '' }}
                </h2>
                {{ contentDate ? new Date(contentDate).toLocaleString() : '' }}

            </div>
            <span v-if="isOnline" class="w-2 h-2 bg-green-500 rounded-full m-4"></span>
            <span v-if="newMessage && !selected" class="w-2 h-2 bg-orange-500 rounded-full m-4"></span>
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