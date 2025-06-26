<script setup>
import profile from '@/assets/img/profile.png'
import capName from '@/functions/capName';
import { useSocketStore } from '@/store/socket';
import axios from 'axios'
import { storeToRefs } from 'pinia';
import router from '@/router';
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
                socket.value.emit('followCreated', followRequest)
                props.notification.type = 'request-accepted'
            }
        }).catch((err) => {})
}


</script>
<template>
    <div class="n-container">
        <div class="flex w-full justify-start items-center " @click="router.push({name: 'userDetails', params: {userId: notification.sender._id}})">
            <div>
                <img :src="profile" class="min-w-12 w-12" />
            </div>
            <div class="flex flex-col">
                <div class="font-bold text-[.75rem]">
                    {{ capName(notification.sender.fname) }} {{ capName(notification.sender.lname) }}
                </div>
                <div class="text-sm md:text-sm">
                    {{ notification.content }}
                </div>
            </div>
        </div>
        <div class="w-20 h-12 flex justify-center items-center">
            <button v-if="notification.type === 'request'" @click="handleFollowAccept"
                class=" button text-sm">Follow</button>
            <span v-if="notification.type === 'request-accepted'"
                class="button bg-gray-300 text-sm text-black flex justify-center items-center">Following</span>

        </div>
    </div>
</template>
<style scoped>
.n-container {
    z-index: 999999;
    width: 100%;
    background-color: white;
    padding: .5rem;
    display: flex;
    flex-direction: row !important;
    border-radius: 1rem;
}

.pic-container {
    width: 50px;
    height: 50px;
    min-width: 50px;
    min-height: 50px;
    border-radius: 100%;
    overflow: hidden;
    margin-right: 1rem
}

@media only screen and (max-width: 1250px) {
    .n-container {
        flex-wrap: wrap;
    }
}
</style>