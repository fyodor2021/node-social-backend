<script setup>
import { defineProps, reactive} from 'vue';
import ContentUser from './ContentUser.vue';
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
    postResponse:''
})
</script>
<template>
        <div :class="`flex flex-col `">
            <div class="flex justify-between items-center">
                <ContentUser :postDate="postResponse.date"
                    :user="postResponse.user"
                    :signedProfilePic="postResponse.signedProfilePic" />
            </div>
            <div @click="() => state.postResponse = postResponse
                " class="p-2  cursor-pointer ">
                <div class="font-bold w-72 text-sm break-words text-justify">
                    {{ postResponse.strContent }}
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
