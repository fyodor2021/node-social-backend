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
  closeOrder: false,
  openReply: ''
})
const openCommentFunc = (id) => {
  state.openComment = id
}
const openReplyFunc = (id) => {
  console.log(id)
  state.openReply = id
}
const handleDeleteComment = (id) => {
  
}
</script>
<template>
  <Comment v-for="comment in comments" :deleteComment="handleDeleteComment" :key="comment._id" :openReply="state.openReply" :openReplyFunc="openReplyFunc"
    :commentResponse="comment" :openCommentFunc="openCommentFunc" :openComment="state.openComment" />
</template>
<style scoped></style>