<script setup>
import { reactive } from 'vue';
import Comment from './Comment.vue';
const props = defineProps({
  comments: {
    type: Array,
    required: true,
    default: []
  },
});
const state = reactive({
  openComment: '',
  closeOrder: false
})
const openCommentFunc = (id) => {
  state.openComment = id
}
</script>
<template>
  <div class="container">
    <Comment  v-for="comment in comments" :key="comment._id" :commentResponse="comment" :openCommentFunc="openCommentFunc" :openComment="state.openComment"/>
  </div>
</template>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>