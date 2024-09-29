<script setup>
import router from '@/router';
import { onMounted, reactive,onUnmounted } from 'vue';
import axios from 'axios'
import Post from '../components/Post.vue'
import CommentList from '@/components/CommentList.vue';
import ReplyBox from '@/components/ReplyBox.vue';
import Loader from '@/components/Loader.vue';
const props = defineProps({
    postId: {
        type: String,
        required: true,
    }
})

const state = reactive({
    liked: false,
    postResponse: '',
    comments: '',
    commentNum: 0,
    isLoaded: false,
})

console.log(state)

const handleScroll = async (e) => {
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight + 112) {
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
}


const closeInputs = (value) => {
    value = !value
}

onMounted(() => {
    if (!props.postId) {
        router.push('/')
    } else {

        axios.get('/post/id', {params: { postId: props.postId}})
            .then(res => {
                state.postResponse = res && res.data
            })
            .then(() => {
                axios.get('/comment', { params: { contentId: state.postResponse.post._id, offset: 0 } })
                    .then(res => {
                        state.comments = res && res.data
                        state.isLoaded = true
                    }).catch(error => {
                        console.log(error)
                    })
            })
    }
    window.addEventListener('scroll', handleScroll)
})


onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
    <div v-if="state.postResponse && state.isLoaded" class="mt-28 h-full w-full">
        <Post :postResponse="state.postResponse" />
        <div class="w-full flex justify-center items-center">
            <div class="reply-container">
                <ReplyBox :contentId="props.postId" />
            </div>
        </div>
        <div class="w-full flex justify-center">
            <div class="comment-list-container">
                <CommentList v-if="state.comments" :comments="state.comments" />
            </div>
        </div>
    </div>
    <Loader v-else />
</template>

<style scoped> 
.details-wrapper {
    border-radius: .5rem .5rem 0 0;
    margin-bottom: 0;
}
.comment-list-container{
    width: 50%;
    min-width: 800px;
}
.reply-container{
    width: 50%;
}
.comment-input {
    background-color: rgba(0, 0, 0, 0.034);
}
.content {
    margin: 10px
}
</style>