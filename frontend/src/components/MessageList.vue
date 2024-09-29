<script setup>
import { useAuthStore } from '@/store/auth';
import Message from './Message.vue';

defineProps({
    messages: {
        type: Array,
        required: true
    },
    signedProfilePic: {
        type: String,
    },
})
const authStore = useAuthStore();

</script>
<template>
    <Message ref="message" v-if="messages" v-for="message in messages" :message="message"
        :signedProfilePic="signedProfilePic" :isSent="message.sender._id === authStore._id" :key="message._id" />
</template>