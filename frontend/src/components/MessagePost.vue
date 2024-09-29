<script setup>
import { defineProps, reactive, ref, onMounted } from 'vue';
import router from '@/router';
import ContentUser from './ContentUser.vue';
import LikeComment from './LikeComment.vue';
import { useAuthStore } from '@/store/auth';

import axios from 'axios';
import { useDisplayStore } from '@/store/display';
import CreateEditView from '@/views/CreateEditView.vue';
import ChatSearchView from '@/views/ChatSearchView.vue';
const props = defineProps({
    postResponse: {
        type: Object,
        required: true
    },
})
const canvas = ref();
const displayStore = useDisplayStore();
const state = reactive({
    liked: false,
    displayOptions: false,
    displayEdit: false,
    displayShare: false,
    displaySend: false,
})
const toggleEdit = () => {
    state.displayEdit = false
}
const toggleShare = () => {
    state.displayShare = !state.displayShare
}
const toggleSend = () => {
    state.displaySend = !state.displaySend
}
const authStore = useAuthStore();
const handlePostDelete = () => {
    axios.delete('post/', { params: { postId: props.postResponse.post._id } }).then(res => {
        if (res && res.status === 204) {
            router.go('/')
        }
    })
}
</script>
<template>
        <div :class="`general-wrapper `">
            <div class="flex justify-between items-center">
                <ContentUser :postDate="postResponse.post.date"
                    :user="postResponse.post.user"
                    :signedProfilePic="postResponse.signedProfilePic" />
            </div>
            <div @click="() => router.push({ name: 'postDetails', params: { postId: postResponse.post._id } })
                " class="p-2 pr-12 pl-12 cursor-pointer ">
                <div class="font-bold w-60 text-sm break-words">
                    {{ postResponse.post.content }}
                </div>
                <div v-if="postResponse.signedPostPic" class="w-72 h-56">
                    <img :src="postResponse.signedPostPic" rel="preload" />
                </div>
            </div>
        </div>
</template>
<style scoped>
.wrapper{
    min-width: none !important;
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