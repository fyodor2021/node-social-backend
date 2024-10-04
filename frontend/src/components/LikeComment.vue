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
    },
    isComment:{
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
        <div class="flex justify-start items-center">
            <div class="flex items-center m-2">
                <span class="cursor-pointer hover:scale-125 duration-300">
                    <i v-if="!state.liked" @click="handleLike" :class="`pi pi-heart text-3xl m-[6px] ${isComment ? 'text-lg' : ''}`"></i>
                    <div v-else @click="handleLike" class="relative flex justify-center items-center">
                        <i   :class="` pi pi-heart-fill animate-ping text-2xl text-red-500 m-[6px] ${isComment ? 'text-lg' : ''}`">
                        </i>
                        <i :class="` pi pi-heart-fill text-3xl m-1.5 absolute top-0 right-0 left-0 bottom-0 ${isComment ? 'text-lg' : ''}`"></i>

                    </div>
                </span>
                <span v-if="!isComment" class="text-xl">{{ state.likeCount }}</span>
            </div>
            <div v-if="!isComment" class="flex items-center m-2">
                <span @click="" class="hover:scale-125 duration-300">
                    <i class="pi pi-comment text-3xl"></i>
                </span>
                <span  class="text-xl ">{{ state.commentCount }}</span>
            </div>
            <ShareIcon v-if="!isComment" @click="() => toggleShare(contentResponse)" class="text-3xl cursor-pointer hover:scale-125 duration-300"/>
            <div v-if="!isComment"  @click="() => toggleSend(contentResponse)" class="flex items-center">
                <span  class="hover:scale-125 duration-300">
                    <i class="pi pi-send text-3xl m-2"></i>
                </span>
            </div>
        </div>
    </div>
</template>