<script setup>
import ChatSearchView from '@/views/ChatSearchView.vue';
import Post from './Post.vue';
import CreateEditView from '@/views/CreateEditView.vue';
import { reactive } from 'vue';
import PostDetailsView from '@/views/PostDetailsView.vue';

const props = defineProps({
  posts: {
    type: Array,
    required: true,
    default: []
  },
  sameUser: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    required: false
  }
});
const state = reactive({
  displayEdit: false,
  displayShare: false,
  displaySend: false,
  displayDetails: false,
  SelectedPostResponse: '',
  selectedPostForAction: ''
})


const toggleEdit = (postResponse) => {
  state.selectedPostForAction = postResponse
  state.displayEdit = !state.displayEdit
  
}
const toggleShare = (postResponse) => {
  state.selectedPostForAction = postResponse
  state.displayShare = !state.displayShare
  
}
const toggleSend = (postResponse) => {
  state.selectedPostForAction = postResponse
  state.displaySend = !state.displaySend
  
}
const handlePostClick = (postResponse) => {
  state.displayDetails = true
  state.SelectedPostResponse = postResponse
  
}
</script>
<template>
  <PostDetailsView v-if="state.SelectedPostResponse && state.displayDetails" :postResponse="state.SelectedPostResponse"
    :clickOutside="() => state.displayDetails = false" />
  <ChatSearchView v-if="state.displaySend && state.selectedPostForAction" :message="state.selectedPostForAction"
    :handleToggleChatSearch="() => state.displaySend = !state.displaySend" />
  <!-- this is the share -->
  <CreateEditView v-if='state.displayShare && state.selectedPostForAction' :isShare="true"
    :postResponse="state.selectedPostForAction" :toggleFunction="toggleShare" />
  <!-- this is the Edit -->

  <CreateEditView v-if='state.displayEdit && state.selectedPostForAction' :postResponse="state.selectedPostForAction"
    :toggleFunction="toggleEdit" />
  <Post v-for="postResponse of posts" :key="postResponse.object._id" 
  :postResponse="postResponse"  
  :handlePostClick="handlePostClick" 
  :toggleEdit="toggleEdit" 
  :toggleShare="toggleShare"
  :toggleSend="toggleSend" />
</template>