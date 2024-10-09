<script setup>
import { defineProps, reactive, ref, onMounted } from 'vue';
import router from '@/router';
import ContentUser from './ContentUser.vue';
import LikeComment from './LikeComment.vue';
import { useAuthStore } from '@/store/auth';

import axios from 'axios';
import { useDisplayStore } from '@/store/display';
import ContentOptions from './ContentOptions.vue';
const props = defineProps({
    postResponse: {
        type: Object,
        required: true
    },
    isShare: {
        type: Boolean,
        default: false
    },
    isDetails: {
        type: Boolean,
        default: false
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
    handlePostClick: {
        type: Function
    }
})
const canvas = ref();
const displayStore = useDisplayStore();
const state = reactive({
    liked: false,
    displayOptions: false,
    postStrContent: props.postResponse.object.strContent.slice(0, 400)
})
const authStore = useAuthStore();
const handlePostDelete = () => {
    axios.delete('post/', { params: { postId: props.postResponse.object._id } }).then(res => {
        if (res && res.status === 204) {
            router.go('/')
        }
    })
}
const toggleOptions = () => {
    state.displayOptions = !state.displayOptions
}
</script>
<template>
    <div :class="`content-container`">
        <div :class="`content-wrapper relative p-4 border border-white`">
            <div class="bg-white p-4 text-black rounded-[1rem] max-h-[800px]">
                <div v-if="!postResponse.object.objContent" class="cursor-pointer max-h-[600px]">
                    <div @click="() => handlePostClick(postResponse)" v-if="postResponse.object.signedPostPic"
                        :class="`image-container`">
                        <img class="max-w-[550px] max-h-[350px]" :src="postResponse.object.signedPostPic" rel="preload" />
                    </div>
                    <div class="flex w-full justify-between items-center relative">
                        <div @click="() => handlePostClick(postResponse)" class="w-[95%]">
                            <div class="float-left p-2 pl-0 bg-black text-white p-2 m-2 ml-0 rounded-xl" >
                                <ContentUser :user="postResponse.object.user" :isPost="true" />
                            </div>
                            <div class="text-justify pt-2 break-all">
                                <span>
                                    {{ state.postStrContent }}
                                </span>
                            </div>
                        </div>
                        <div class="w-[5%]" v-if="!isShare && !isDetails"
                            @click="() => state.displayOptions = !state.displayOptions">
                            <ContentOptions :contentResponse="postResponse"
                                :editContent="() => toggleEdit(postResponse)" :deleteContent="handlePostDelete"
                                :displayOptions="state.displayOptions" :toggleOptions="toggleOptions" />
                        </div>
                    </div>
                </div>
                <div v-else :class="`w-full flex justify-center items-center max-h-[750px] flex-col ${isDetails ? 'h-full' : ''}`">
                    <div class="w-full pt-0 ">
                        <div class="flex">
                            <div class=" flex items-center w-full">
                                <ContentUser :user="postResponse.object.user" :isPost="true" />
                                <span v-if="!isDetails && postResponse.object.objContent"
                                    class="button h-10 bg-gray-400 rounded-none">
                                    @Reposted
                                </span>
                            </div>
                            <div v-if="!isShare && !isDetails" class="flex justify-center items-center"
                                @click="() => state.displayOptions = !state.displayOptions">
                                <ContentOptions :contentResponse="postResponse"
                                    :editContent="() => toggleEdit(postResponse)" :deleteContent="handlePostDelete"
                                    :displayOptions="state.displayOptions" :toggleOptions="toggleOptions" />
                            </div>
                        </div>
                        <div v-if="state.postStrContent"
                            class="text-[.90rem] ml-4 w-[90%] text-justify break-all pb-2">
                            <span>
                                {{ state.postStrContent }}
                            </span>
                        </div>
                    </div>
                    <div :class="`w-3/4 ${isDetails ? 'h-full w-full' : ''}`">
                        <Post :postResponse="postResponse.object.objContent" :user="postResponse.object.objContent.user"
                            :handlePostClick="handlePostClick" :isShare="true" />
                    </div>
                </div>

                <div class="w-1/4 ml-7 p-1">
                    <LikeComment v-if="!isShare && !isDetails" :toggleSend="toggleSend" :toggleShare="toggleShare"
                        :contentResponse="postResponse" :handlePostClick="handlePostClick" />
                </div>
            </div>

        </div>
    </div>
</template>
<style scoped></style>

<!-- .tracker {
    height: 20px;
    margin-left: 2.8rem;
    border: 2px solid rgb(0, 0, 0);
    border-right: none;
    border-radius: 1rem 0 0 0;
    border-bottom: none;
    /* margin-top: 15px; */
} -->