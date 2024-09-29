<script setup>
import Post from './Post.vue';
const props = defineProps({
  posts: {
    type: Array,
    required: true,
    default: []
  },
  sameUser:{
    type:Boolean,
    default:false
  },
  user:{
    type: Object,
    required: false
  }

});
</script>
<template>
    <Post v-for="post in posts" :key="post._id" :postResponse="post" :sameUser="sameUser" :user="user"/>
</template>