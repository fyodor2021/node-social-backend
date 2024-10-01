<script setup>
import profile from '@/assets/img/profile.png'
import capName from '@/functions/capName';
import { useSocketStore } from '@/store/socket';
import axios from 'axios'
import { storeToRefs } from 'pinia';
const props = defineProps({
    notification: {
        type: Object,
        required: true
    }
})
const socketStore = useSocketStore();
const { socket } = storeToRefs(socketStore)
const handleFollowAccept = () => {
    const followRequest = {
        sender: props.notification.receiver,
        receiver: props.notification.sender,
    }
    axios.post('connection/request', followRequest)
    .then(res => {
        if (res && res.status === 201) {
            console.log('im here')
            socket.value.emit('followCreated', followRequest)
            props.notification.type = 'request-accepted'
        }
    })
}


</script>
<template>
    <div class="n-container">
        <div class="flex w-full">
            <div class="profile-pic-container pic-container">
                <img :src="profile" />
            </div>
            <div class="flex justify-center items-start flex-col">
                <div class="flex">
                    <div class="font-bold text-xl">{{ capName(notification.sender.fname) }} {{ capName(notification.sender.lname) }}</div>
                </div>
                <div class="text-lg"> 
                    {{ notification.content }}
                </div>
            </div>
        </div>
        <div class="w-24 h-12 flex justify-center items-center">
            <button v-if="notification.type === 'request'"  @click="handleFollowAccept" class=" button text-lg">Follow</button>
            <span v-if="notification.type === 'request-accepted'" class="button bg-gray-300 text-lg text-black flex justify-center items-center">Following</span>

        </div>
    </div>
</template>
<style scoped>
.n-container {
    z-index: 999999;
    width: 100%;
    background-color: white;
    padding: 1.5rem;
    display: flex;
    flex-direction: row !important;
    border-radius: 1rem;
}
.pic-container{
    width: 50px;
    height: 50px;
    border-radius: 100%;
    overflow: hidden;
    margin-right: 1rem
}
</style>