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
    <Comment  v-for="comment in comments" :key="comment._id" :commentResponse="comment" :openCommentFunc="openCommentFunc" :openComment="state.openComment"/>
</template>
<style scoped>

</style>