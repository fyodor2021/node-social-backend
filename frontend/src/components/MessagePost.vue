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
import PostDetailsView from '@/views/PostDetailsView.vue';
const props = defineProps({
    postResponse: {
        type: Object,
        required: true
    },
})
const state = reactive({
    liked: false,
    displayOptions: false,
    displayEdit: false,
    displayShare: false,
    displaySend: false,
    postResponse: '',
})
</script>
<template>
        <div :class="`flex flex-col `">
            <div class="flex justify-between items-center">
                <ContentUser :postDate="postResponse.post.date"
                    :user="postResponse.post.user"
                    :signedProfilePic="postResponse.signedProfilePic" />
            </div>
            <div @click="() => state.postResponse = postResponse
                " class="p-2  cursor-pointer ">
                <div class="font-bold w-60 text-sm break-words">
                    {{ postResponse.post.strContent }}
                </div>
                <div v-if="postResponse.signedPostPic" class="max-w-72 max-h-56">
                    <img :src="postResponse.signedPostPic" rel="preload" />
                </div>
            </div>
            <div class="text-black ">
                <PostDetailsView v-if="state.postResponse" :postResponse="postResponse" :clickOutside="() => state.postResponse = ''"/>
            </div>
        </div>
</template>


<!-- .tracker {
    height: 20px;
    margin-left: 2.8rem;
    border: 2px solid rgb(0, 0, 0);
    border-right: none;
    border-radius: 1rem 0 0 0;
    border-bottom: none;
    /* margin-top: 15px; */
} -->