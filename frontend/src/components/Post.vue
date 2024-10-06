<script setup>
import { defineProps, reactive, ref, onMounted } from 'vue';
import router from '@/router';
import ContentUser from './ContentUser.vue';
import LikeComment from './LikeComment.vue';
import { useAuthStore } from '@/store/auth';

import axios from 'axios';
import { useDisplayStore } from '@/store/display';
const props = defineProps({
    postResponse: {
        type: Object,
        required: true
    },
    sameUser: {
        type: Boolean,
        default: false
    },
    user: {
        type: Object,
    },
    isShare: {
        type: Boolean,
        default: false
    },
    isDetails:{
        type: Boolean,
        default:false
    },
    toggleSend: {
        type: Function
    },
    toggleShare: {
        type: Function
    },
    toggleEdit: {
        type: Function
    },
    handlePostClick:{
        type: Function
    }
})
const canvas = ref();
const displayStore = useDisplayStore();
const state = reactive({
    liked: false,
    displayOptions: false,

})

const authStore = useAuthStore();
const handlePostDelete = () => {
    axios.delete('post/', { params: { postId: props.postResponse.post._id } }).then(res => {
        if (res && res.status === 204) {
            router.go('/')
        }
    })
}
console.log(props.isShare, props.isDetails)
</script>
<template>
    <div :class="`content-container `">
        <div :class="`content-wrapper relative `">
            <div v-if="!isDetails" class="flex justify-between p-2 items-center">
                <ContentUser :postDate="postResponse.post.date"
                    :user="sameUser ? '' : user ? user : postResponse.post.user"
                    :signedProfilePic="sameUser ? '' : user ? user.signedProfilePic : postResponse.signedProfilePic" />
                <i @click="() => state.displayOptions = !state.displayOptions"
                    v-if="postResponse.post.user._id === authStore._id" class="pi pi-ellipsis-v text-2xl text-gray-400">
                </i>
                <div v-if="state.displayOptions" class="crud-menu">
                    <div class="triangle f"></div>
                    <div class="crud-item" @click="handlePostDelete">
                        <div class="w-full pt-1 pb-1 pr-2 pl-2 cursor-pointer flex items-center">
                            <i class="pi pi-times-circle mr-2 text-red-500"></i><span class="text-white">Delete</span>
                        </div>
                    </div>
                    <div class="crud-item" @click="() => state.displayEdit = !state.displayEdit">
                        <div class="w-full pt-1 pb-1 pr-2 pl-2 cursor-pointer flex items-center">
                            <i class="pi pi-pen-to-square mr-2 text-green-500"></i><span class="text-white">Edit</span>
                        </div>
                    </div>
                </div>
            </div>
            <div @click="() => handlePostClick(postResponse)" class="p-2 pr-12 pl-12 cursor-pointer">
                <div  v-if="!isDetails" class="font-bold text-lg">
                    {{ postResponse.post.content }}
                </div>
                <div v-if="postResponse.signedPostPic" class="image-container">
                    <img :src="postResponse.signedPostPic" rel="preload" />
                </div>
            </div>
            <LikeComment v-if="!isShare && !isDetails" :toggleSend="toggleSend" :toggleShare="toggleShare"
            :contentResponse="postResponse" />
        </div>
    </div>
</template>
<style scoped>
.crud-menu {
    position: absolute;
    right: 1.25rem;
    top: 5.6rem;
    opacity: .8;
    padding: .5rem;
    border-radius: .5rem 0 .5rem .5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
}

.crud-item {
    background-color: rgb(0, 0, 0);

}
</style>

<!-- .tracker {
    height: 20px;
    margin-left: 2.8rem;
    border: 2px solid rgb(0, 0, 0);
    border-right: none;
    border-radius: 1rem 0 0 0;
    border-bottom: none;
    /* margin-top: 15px; */
} -->