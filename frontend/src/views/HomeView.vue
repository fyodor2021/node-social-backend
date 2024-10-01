<script setup>
import { onMounted, onUnmounted, reactive, } from 'vue';
import axios from 'axios'
import PostList from '@/components/PostList.vue';
import Loader from '@/components/Loader.vue';
import { useAuthStore } from '@/store/auth';
const state = reactive({
  posts: [],
  isLoading: true,

})

const authStore = useAuthStore()
async function handleScroll(e) {
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight + 112) {
    axios.get('/post/', { params: { offset: state.posts.length } }).then((res) => {
      state.posts = res && [...state.posts, ...res.data]
    })
  }
}

onMounted(async () => {
  axios.get('/post/', { params: { offset: 0 } }).then(res => {
    state.posts = res && res.data
    state.isLoading = false
  })
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

</script>
<template>
  <div class="mt-28 ">
    <div class="xl:w-2/4 mx-auto mt-0 mb-0 w-full">
      <Loader v-if="state.isLoading" />
      <PostList v-else :posts="state.posts" />
    </div>
  </div>
</template>
