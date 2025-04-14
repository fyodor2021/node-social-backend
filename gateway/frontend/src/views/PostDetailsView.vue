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
import { useAuthStore } from '@/store/auth';
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
const authStore = useAuthStore();
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
        axios.get('/comment', { params: { contentId: props.postResponse._id, offset: state.comments.length } })
            .then(res => {
                if (res.status === 200) {
                    state.comments = [...state.comments, ...res.data]
                }
            }).catch((err) => { })
    }
}

const handleCreateComment = (input, contentId) => {
    if (input) {
        const request = {
            user: {
                _id: authStore._id,
                fname: authStore.fname,
                lname: authStore.lname
            },
            contentId: contentId,
            content: input
        }
        axios.post('/comment', request).then(res => {
            state.comments.unshift(res.data)
            props.openCommentFunc(props.commentResponse._id)
            props.commentResponse.commentCount++
            handleContentClick();
        })
    }
}
onMounted(async () => {
    state.isLoading = true
    await axios.get('/comment', { params: { contentId: props.postResponse._id, offset: 0 }, signal: state.abortController.signal })
        .then(res => {
            state.comments = res && res.data
            state.isLoading = false
            setTimeout(() => {
                commentListRef.value.addEventListener('scroll', handleScroll)
                state.hasListener = true
            }, 1);
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
                <BackIcon class="text-gray-500 w-10 h-10" @click="clickOutside" />
                <div v-if="!postResponse.objContent" class="flex h-full justify-center items-center flex-col">
                    <img class="max-w-[100%]" :src="postResponse.signedPostPic" />
                </div>
                <div v-else class="h-full w-full">
                    <Post :postResponse="postResponse.objContent" :user="postResponse.objContent.user"
                        :handlePostClick="handlePostClick" :isShare="true" />
                </div>
            </div>
            <div class="flex h-[80%] flex-[2] flex-col justify-between md:w-[100%] mdh:w-[100%]  p-4">
                <div>
                    <div class="">
                        <ContentUser :user="postResponse.user" />
                    </div>
                    <div class="font-bold ml-4">
                        {{ postResponse.strContent }}
                    </div>
                </div>
                <div>
                    <div v-if="state.isLoading" class="w-full flex justify-center">
                        <SpinnerIcon class="mt-12 w-12 h-12 flex justify-center items-center" />
                    </div>
                    <div v-else class="comment-list" ref="commentListRef">
                        <CommentList v-if="state.comments" :comments="state.comments" />
                    </div>
                    <div class="w-[30%] md:w-1/4">
                        <LikeComment :isDetails="true" :contentResponse="postResponse" />
                    </div>
                    <ReplyBox :handleCreateComment="handleCreateComment" :isPost="true" :contentId="postResponse._id" />
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
    height: 65%;
    max-height: 430px;
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