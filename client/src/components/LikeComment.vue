<script setup>
import { useAuthStore } from '@/store/auth';
import { reactive} from 'vue';
import axios from 'axios'
import ShareIcon from '~icons/material-symbols/share-outline'
import commentIcon from '~icons/material-symbols/mode-comment-outline'
import heartIcon from '~icons/mdi/heart-multiple-outline'
import heartFillIcon from '~icons/mdi/heart-multiple'
const authStore = useAuthStore();
const props = defineProps({
    contentResponse: {
        type: Object,
        required: true
    },
    toggleShare: {
        type: Function,
    },
    toggleSend: {
        type: Function,
    },
    isComment: {
        type: Boolean,
        default: false,
    },
    isDetails: {
        type: Boolean,
        default: false,
    },
    handlePostClick: {
        type: Function
    }
})
const state = reactive({
    liked: props.contentResponse.liked,
    likeCount: props.contentResponse.likeCount,
    commentCount: props.contentResponse.commentCount,
})

const handleLike = async () => {
    axios
        .post('/like', {
            userId: authStore._id,
            contentId: props.contentResponse._id
        })
        .then(res => {
            if (res.status === 201) {
                state.liked = true
                state.likeCount++
            }
            if (res.status === 204) {
                state.liked = false
                state.likeCount--
            }
        })
}

</script>
<template>
    <div class="flex flex-col justify-center">
        <div class="flex justify-around items-center">
            <div class="flex items-center cursor-pointer">
                <heartIcon v-if="!state.liked" @click="handleLike"
                    :class="`pi pi-heart text-3xl  hover:scale-125 duration-300  ${isComment ? 'text-lg' : ''}`" />
                <div v-else @click="handleLike" class="relative flex justify-center items-center">
                    <heartFillIcon
                        :class="` pi pi-heart-fill animate-ping text-3xl   text-red-500 ${isComment ? 'text-lg' : ''}`" />
                    <heartFillIcon
                        :class="` pi pi-heart-fill text-3xl  absolute top-0 right-0 left-0 bottom-0   ${isComment ? 'text-lg' : ''}`" />
                </div>
                <span v-if="!isComment && !isDetails" class="text-xl">{{ state.likeCount }}</span>
            </div>
            <div v-if="!isComment" class="flex items-center m-2">
                <span  class="hover:scale-125 duration-300 cursor-pointer ">
                    <commentIcon class="text-3xl" v-on:click="!isDetails ? handlePostClick(contentResponse) : ''" />
                </span>
                <span class="text-xl" v-if="!isDetails">{{ state.commentCount }}</span>
            </div>
            <div v-if="!isComment && !isDetails" class="text-3xl cursor-pointer ">
                <ShareIcon @click="() => toggleShare(contentResponse)" />
            </div>
            <div v-if="!isComment && !isDetails" @click="() => toggleSend(contentResponse)" class="flex items-center">
                <span class="hover:scale-125 duration-300 cursor-pointer ">
                    <i class="pi pi-send text-3xl m-2"></i>
                </span>
            </div>
        </div>
    </div>
</template>