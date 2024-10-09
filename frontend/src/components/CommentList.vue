<script setup>
import { reactive } from 'vue';
import Comment from './Comment.vue';
import { useAuthStore } from '@/store/auth';
import axios from 'axios'
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
  openReply: '',
})
const authStore = useAuthStore();
const openCommentFunc = (id) => {
  state.openComment = id
}
const openReplyFunc = (id) => {
  state.openReply = id
}
const handleDeleteComment = (commentResponse) => {
  const index = props.comments.indexOf(commentResponse);
  props.comments.splice(index, 1)
}
</script>
<template>
  <Comment v-for="comment in comments" :deleteComment="handleDeleteComment"
    :key="comment.object._id" :openReply="state.openReply" :openReplyFunc="openReplyFunc" :commentResponse="comment"
    :openCommentFunc="openCommentFunc" :openComment="state.openComment" />
</template>
<style scoped></style>