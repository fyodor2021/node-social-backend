<script setup>
import { onMounted, onUnmounted, reactive, } from 'vue';
import axios from 'axios'
import PostList from '@/components/PostList.vue';
import Loader from '@/components/Loader.vue';
import { useAuthStore } from '@/store/auth';
import PostDetailsView from './PostDetailsView.vue';
const state = reactive({
  posts: [],
  isLoading: true,

})

const authStore = useAuthStore()
async function handleScroll(e) {
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
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
  <div class="h-container">
    <div class=" mx-auto w-full">
      <Loader v-if="state.isLoading" />
      <PostList v-else :posts="state.posts" />
    </div>
  </div>
</template>
<style scoped>
.h-container{
  padding-top: 1rem;
}
@media only screen and (max-width:1775px) {
    .h-container {
      margin-top: 112px;
    }
}
</style>