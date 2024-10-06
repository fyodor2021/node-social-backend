<script setup>
import router from '@/router';
import { onMounted, reactive, onUnmounted, ref, nextTick, watch, onBeforeMount, onBeforeUnmount } from 'vue';
import axios from 'axios'
import Post from '../components/Post.vue'
import CommentList from '@/components/CommentList.vue';
import ReplyBox from '@/components/ReplyBox.vue';
import Loader from '@/components/Loader.vue';
import LikeComment from '@/components/LikeComment.vue';
const props = defineProps({
    postId: {
        type: String,
        required: true,
    }
})

const commentListRef = ref()

const state = reactive({
    liked: false,
    postResponse: '',
    comments: '',
    commentNum: 0,
    isLoaded: false,
})

const handleScroll = (e) => {
    if (commentListRef.value.scrollTop + commentListRef.value.clientHeight === commentListRef.value.scrollHeight) {
        axios.get('/comment', { params: { contentId: state.postResponse.post._id, offset: state.comments.length } })
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
    if (!props.postId) {
        router.push('/')
    } else {
        axios.get('/post/id', { params: { postId: props.postId } })
            .then(res => {
                state.postResponse = res && res.data
            })
            .then(async () => {
                await axios.get('/comment', { params: { contentId: state.postResponse.post._id, offset: 0 } })
                    .then(res => {
                        state.comments = res && res.data
                        state.isLoaded = true
                        setTimeout(() => {

                            commentListRef.value.addEventListener('scroll', handleScroll)
                        }, 1);
                    }).catch(error => {
                        console.log(error)
                    })
            })
    }

})
onBeforeUnmount(() => {
    commentListRef.value.removeEventListener('scroll', handleScroll)
})
</script>
<template>
    <div v-if="state.postResponse && state.isLoaded" class="p-d-container ">
        <div>
            <Post :is-share="true" :postResponse="state.postResponse" />
        </div>
        <div>
            <div v-if="state.comments" class="comment-list" ref="commentListRef">
                <CommentList v-if="state.comments" :comments="state.comments" />
            </div>
            <LikeComment :contentResponse="state.postResponse" />
            <ReplyBox :contentId="props.postId" />
        </div>
    </div>
    <Loader v-else />
</template>

<style scoped>
.p-d-container {
    width: 75%;
    display: flex;
    padding-right: 1rem;
    border-radius: .5rem;
    margin-left: auto;
    margin-top: 2rem;
}

.comment-list {
    height: 75vh;
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