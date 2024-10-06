<script setup>
import { useAuthStore } from '@/store/auth';
import { onMounted, reactive, watch } from 'vue';
import { useDisplayStore } from '@/store/display'
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
        type: Boolean
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
            contentId: props.contentId
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
            <div class="flex items-center">
                <span class="cursor-pointer hover:scale-125 duration-300">
                    <heartIcon v-if="!state.liked" @click="handleLike"
                        :class="`pi pi-heart text-3xl ${isComment ? 'text-lg' : ''}`" />
                    <div v-else @click="handleLike" class="relative flex justify-center items-center">
                        <heartFillIcon
                            :class="` pi pi-heart-fill animate-ping text-3xl text-red-500 ${isComment ? 'text-lg' : ''}`" />
                        <heartFillIcon
                            :class="` pi pi-heart-fill text-3xl  absolute top-0 right-0 left-0 bottom-0 ${isComment ? 'text-lg' : ''}`" />

                    </div>
                </span>
                <span v-if="!isComment" class="text-xl">{{ state.likeCount }}</span>
            </div>
            <div v-if="!isComment" class="flex items-center m-2">
                <span @click="" class="hover:scale-125 duration-300">
                    <commentIcon class="text-3xl" />
                </span>
                <span class="text-xl ">{{ state.commentCount }}</span>
            </div>
            <ShareIcon v-if="!isComment" @click="() => toggleShare(contentResponse)" class="text-3xl" />
            <div v-if="!isComment" @click="() => toggleSend(contentResponse)" class="flex items-center">
                <span class="hover:scale-125 duration-300">
                    <i class="pi pi-send text-3xl m-2"></i>
                </span>
            </div>
        </div>
    </div>
</template>