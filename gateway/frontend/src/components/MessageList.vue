<script setup>
import { useAuthStore } from '@/store/auth';
import Message from './Message.vue';

const props = defineProps({
    messages: {
        type: Array,
        required: true
    },
    signedProfilePic: {
        type: String,
    },
    hideInput:{
        type:Function,
        required: true,
    }
})
const authStore = useAuthStore();

</script>
<template>
    <div class="m-l-container overflow-auto min-h-[50vh]">
        <Message ref="message" v-if="messages" v-for="message in messages" :message="message" :hideInput="props.hideInput"
            :signedProfilePic="signedProfilePic" :isSent="message.sender._id === authStore._id" :key="message._id" />
    </div>
</template>
