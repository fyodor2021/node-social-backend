<script setup>
import { onBeforeMount, reactive, onUnmounted, watch, onUpdated, onMounted } from 'vue';
import axios from 'axios'
import PostList from '@/components/PostList.vue';
import Profile from '@/components/Profile.vue'
import Loader from '@/components/Loader.vue';
import { useAuthStore } from '@/store/auth';
import router from '@/router';
const authStore = useAuthStore();
const props = defineProps({
    userId: {
        type: String,
    }
})
const state = reactive({
    userResponse: '',
    posts: '',
    isLoaded: false,
    sameUser: props.userId === authStore._id ? true : false,
    componentKey: 1,
    differentData: false
})
async function handleScroll(e) {
    if (window.scrollY + window.innerHeight >= document.body.scrollHeight + 112) {
        axios.get('/post/user/id/', {
            params: {
                offset: state.posts.length,
                contentUserId: props.userId,
            }
        })
            .then((res) => {
                state.posts = [...state.posts, ...res.data]
                state.postCount = res.data.postCount
            })
    }
}
onMounted(async () => {
    await getUserData(props.userId)
    window.addEventListener('scroll', handleScroll)
})
console.log(router)
watch(router.currentRoute, async () => {
    await getUserData(props.userId)
})
async function getUserData(userId) {
    const [userRes, postRes] = await Promise.all([
    axios.get('/user/id/', { params: { visitedUserId: props.userId } }),
    axios.get('/post/user/id/', { params: { offset: 0, contentUserId: props.userId } })
    ])
    if ((userRes && userRes.data) && (postRes && postRes.data)) {
        state.posts = postRes.data
        state.userResponse = userRes.data
        state.postCount = postRes.postCount
        state.sameUser = false
        state.isLoaded = true
    }
}
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
console.log(state)
</script>
<template>
    <div v-if="state.isLoaded">
        <Profile v-if="state.userResponse" :userResponse="state.userResponse" />
        <PostList v-if="state.posts" :posts="state.posts" :sameUser="state.sameUser" :user="state.userResponse.user" />
    </div>
    <Loader v-else />
</template>