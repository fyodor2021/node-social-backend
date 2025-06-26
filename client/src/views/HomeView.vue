<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, } from 'vue';
import axios from 'axios'
import PostList from '@/components/PostList.vue';
import Loader from '@/components/Loader.vue';
const state = reactive({
  posts: [],
  isLoading: true,
  disableScroll: false,
})

function handleScroll(e) {
  const marginTop = window.innerWidth < 1775 ? 112 : 0
  if (window.scrollY + window.innerHeight >= document.body.scrollHeight + marginTop) {
    axios.get('/post/', { params: { offset: state.posts.length } }).then((res) => {
      state.posts = res && [...state.posts, ...res.data]
    }).catch((err) => {})
  }
}

onMounted(() => {
  axios.get('/post/', { params: { offset: 0 } }).then(res => {
    console.log(res)
    state.posts = res && res.data
    state.isLoading = false
    setTimeout(() => {
      window.addEventListener('scroll', handleScroll)
    }, 1);
  }).catch((err) => {})
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
<template>
  <div :class="`h-container xl:mt-28`">
    <div :class="` mx-auto w-full ${state.disableScroll ? 'overflow-hidden' : ''}`">
      <Loader v-if="state.isLoading" />
      <div v-else>
        <div class="mx-auto">
          <PostList  :posts="state.posts" />
        </div>
      </div>
    </div> 
  </div>
</template>
<style scoped>
.h-container {
  padding-top: 1rem;
}

</style>