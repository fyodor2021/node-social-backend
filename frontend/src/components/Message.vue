<script setup>
import profile from '@/assets/img/profile.png'
import { defineProps, reactive } from 'vue';
import MessagePost from './MessagePost.vue';
import ForwardIcon from '~icons/material-symbols-light/forward-circle-outline-rounded'
import ChatSearchView from '@/views/ChatSearchView.vue';
const props = defineProps({
    signedProfilePic: {
        type: String,
    },
    isSent: {
        type: Boolean,
        default: false
    },
    message: {
        type: Object,
        required: true
    }
})
const state = reactive({
    displaySend: false
})
const toggleSend = () => {
    state.displaySend = !state.displaySend
}
</script>
<template>
    <ChatSearchView v-if="state.displaySend && message.content.post" :message="message.content"
        :handleToggleChatSearch="() => state.displaySend = !state.displaySend" />
    <div :class="`m-container w-full   ${isSent ? 'justify-end' : ''}`">
        <ForwardIcon v-if="isSent && message.content.post" @click="() => toggleSend()"
            class="text-3xl cursor-pointer hover:scale-125 duration-300 " />
        <div :class="`wrapper`">
            <div v-if="!isSent" class="profile-pic-container w-12 h-12 mr-2 sm:hidden">
                <img :src="signedProfilePic ?
                    signedProfilePic :
                    profile" alt="User Avatar">
            </div>
            <div v-if="!message.content.post" class="text-container">
                <p>{{ message.content }}</p>
            </div>
            <div class="text-container " v-else>
                <MessagePost :postResponse="message.content" :isShare="true" />
            </div>
        </div>
        <ForwardIcon v-if="!isSent && message.content.post" @click="() => toggleSend()"
            class="text-3xl cursor-pointer min-w-12" />
    </div>

</template>

<style scoped>
.m-container {
    width: 100%;
    display: flex;
    align-items: center;
}

.wrapper {
    display: flex;
    max-width: 50%;
    justify-content: flex-end;
    align-items: center;
    padding: 5px;
}

.text-container {
    background-color: rgb(0, 0, 0);
    color: rgb(255, 255, 255);
    padding: 1rem;
    width: fit-content;
    white-space: break-spaces;
    border-radius: 1rem;
    overflow-wrap: break-word;

}
@media only screen and (max-width: 1000px){
    .wrapper{
        max-width: 100%;
    }
}
</style>