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
const props = defineProps({
    postResponse: {
        type: Object,
        required: true,
    }
})

const commentListRef = ref()

const state = reactive({
    liked: false,
    comments: '',
    commentNum: 0,
})

const handleScroll = (e) => {
    if (commentListRef.value.scrollTop + commentListRef.value.clientHeight === commentListRef.value.scrollHeight) {
        axios.get('/comment', { params: { contentId: props.postResponse.post._id, offset: state.comments.length } })
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    state.comments = [...state.comments, ...res.data]
                }
            }).catch(error => {
                console.log(error)
            })

    }
    console.log(commentListRef.value.scrollTop + commentListRef.value.clientHeight === commentListRef.value.scrollHeight)
}

const closeInputs = (value) => {
    value = !value
}

onMounted(async () => {
    await axios.get('/comment', { params: { contentId: props.postResponse.post._id, offset: 0 } })
        .then(res => {
            state.comments = res && res.data
            commentListRef.value.addEventListener('scroll', handleScroll)
        }).catch(error => {
            console.log(error)
        })
})
onBeforeUnmount(() => {
    commentListRef.value.removeEventListener('scroll', handleScroll)
})
</script>
<template>
    <div class="w-screen h-screen bg-[#0000001f] top-0 flex justify-around items-center fixed z-[999999]">
        <div v-if="postResponse" class="p-d-container ">
            <div>
                <Post :postResponse="postResponse" :isDetails="true" />
            </div>
            <div class="flex flex-col justify-between h-full w-[30%]">
                <div class="h-[80%]">
                    <ContentUser :postDate="postResponse.post.date" :user="postResponse.post.user"
                        :signedProfilePic="postResponse.signedProfilePic" />
                    <div class="font-bold text-sm">
                        {{ postResponse.post.content }}
                    </div>
                    <div v-if="state.comments" class="comment-list" ref="commentListRef">
                        <CommentList v-if="state.comments" :comments="state.comments" />
                    </div>
                </div>
                <div class="h-[20%]">
                    <LikeComment :contentResponse="postResponse" />
                    <ReplyBox :contentId="postResponse.post._id" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.p-d-container {
    width: 65%;
    height: 80%;
    display: flex;
    padding-right: 1rem;
    border-radius: .5rem;
    z-index: 9999999;
    background-color: white;
}

.comment-list {
    height: 65%;
    overflow: auto;
}

@media only screen and (max-width: 1775px) {
    .p-d-container {
        margin: 0 auto;
        margin-top: 112px;
    }
}

@media only screen and (max-width: 1550px) {
    .p-d-container {
        width: 100%;
        flex-direction: column;
        outline: none;
        box-shadow: none;
        padding: 0;
    }

    .comment-list {
        width: 100%;
    }
}
</style>