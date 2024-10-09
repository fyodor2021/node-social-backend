<script setup>
import router from '@/router';
import { onMounted, reactive, onUnmounted, ref, nextTick, watch, onBeforeMount, onBeforeUnmount } from 'vue';
import axios from 'axios'
import Post from '../components/Post.vue'
import CommentList from '@/components/CommentList.vue';
import ReplyBox from '@/components/ReplyBox.vue';
import Loader from '@/components/Loader.vue';
import LikeComment from '@/components/LikeComment.vue';
import ContentUser from '@/components/ContentUser.vue';
import SpinnerIcon from '~icons/line-md/loading-twotone-loop'
import BackIcon from '~icons/tabler/arrow-back-up'
const props = defineProps({
    postResponse: {
        type: Object,
        required: true,
    },
    clickOutside: {
        type: Function,
        required: true
    }
})

const commentListRef = ref()

const state = reactive({
    liked: false,
    comments: '',
    commentNum: 0,
    isLoading: false,
    hasListener: false,
    abortController: new AbortController
})

const handleScroll = (e) => {
    if (commentListRef.value.scrollTop + commentListRef.value.clientHeight === commentListRef.value.scrollHeight) {
        axios.get('/comment', { params: { contentId: props.postResponse.object._id, offset: state.comments.length } })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    state.comments = [...state.comments, ...res.data]
                }
            }).catch(error => {
                console.log(error)
            })

    }
    
}


onMounted(async () => {
    state.isLoading = true
    await axios.get('/comment', { params: { contentId: props.postResponse.object._id, offset: 0 }, signal: state.abortController.signal })
        .then(res => {
            state.comments = res && res.data
            state.isLoading = false
            setTimeout(() => {
                commentListRef.value.addEventListener('scroll', handleScroll)
                state.hasListener = true
            }, 1);
        }).catch(error => {
            console.log(error)
        })

})
onBeforeUnmount(() => {
    if (state.hasListener) {
        commentListRef.value.removeEventListener('scroll', handleScroll)
    } else {
        state.abortController.abort()
    }
})
</script>
<template>
    <div
        class="w-screen h-[100%] min-h-[600px] overflow-auto bg-[#0000001f] top-0 left-0 flex justify-center md:justify-end items-center fixed z-[100] 3xl:mt-28 3xl:h-[90%]">
        <div class="p-d-container relative" v-click-outside="clickOutside">
            <div class="flex flex-col flex-[4] justify-start">
                <BackIcon class="text-gray-500 w-10 h-10" @click="router.go('/')" />
                <div class="flex h-full justify-center items-center flex-col">
                    <img class="max-w-[100%]" :src="postResponse.object.signedPostPic" />
                </div>
            </div>
            <div class="flex h-[100%] flex-[2] flex-col justify-between md:w-[100%] mdh:w-[100%]  p-4">
                <div>
                    <div class="">
                        <ContentUser :user="postResponse.object.user"/>
                    </div>
                    <div class="font-bold text-sm">
                        {{ postResponse.object.strContent }}
                    </div>
                </div>
                <div v-if="state.isLoading" class="w-full flex justify-center">
                    <SpinnerIcon class="mt-12 w-12 h-12 flex justify-center items-center" />
                </div>
                <div v-else class="comment-list" ref="commentListRef">
                    <CommentList v-if="state.comments" :comments="state.comments" />
                </div>
                <div>
                    <div class="w-[70%] md:w-1/4">
                        <LikeComment :contentResponse="postResponse" />
                    </div>
                    <ReplyBox :isPost="true" :contentId="postResponse.object._id" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.p-d-container {
    height: 80%;
    width: 70%;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border-radius: .5rem;
    z-index: 9999999;
    background-color: white;
}

.comment-list {
    overflow: auto;
}

@media only screen and (max-width: 1775px) {
    .p-d-container {
        margin: 0 auto;
        margin-top: 112px;
    }
}

@media only screen and (max-width: 1300px) {

    .p-d-container {
        width: 100%;
        height: 100%;
        min-width: none;
        margin-top: 0;
        overflow-y: auto;
        flex-direction: column;
    }

    .comment-list {
        height: 100%;
    }
}
</style>