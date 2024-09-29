<script setup>
import { useAuthStore } from '@/store/auth';
import { onMounted, reactive, watch } from 'vue';
import {useDisplayStore} from '@/store/display'
import CreateEditView from '@/views/CreateEditView.vue'
import axios from 'axios'
import ShareIcon from '~icons/mdi/share-variant-outline'
const authStore = useAuthStore();
const displayStore = useDisplayStore();
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
        <div class="flex justify-start items-center">
            <div class="flex items-center">
                <span class="cursor-pointer hover:scale-125 duration-300">
                    <i v-if="!state.liked" @click="handleLike" class="pi pi-heart text-3xl m-2"></i>
                    <div v-else @click="handleLike" class="relative flex justify-center items-center">
                        <i   :class="` pi pi-heart-fill animate-ping text-2xl text-red-500 m-2`">
                        </i>
                        <i :class="` pi pi-heart-fill text-3xl m-1.5 absolute top-0 right-0 left-0 bottom-0`"></i>

                    </div>
                </span>
                <span class="text-2xl">{{ state.likeCount }}</span>
            </div>
            <ShareIcon @click="() =>toggleShare()" class="text-3xl cursor-pointer hover:scale-125 duration-300"/>
            <div class="flex items-center">
                <span @click="" class="hover:scale-125 duration-300">
                    <i class="pi pi-comment text-3xl m-2"></i>
                </span>
                <span class="text-2xl">{{ state.commentCount }}</span>
            </div>
            <div @click="() => toggleSend()" class="flex items-center">
                <span  class="hover:scale-125 duration-300">
                    <i class="pi pi-send text-3xl m-2"></i>
                </span>
            </div>
        </div>
    </div>
</template>