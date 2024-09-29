<script setup>
import backgroundPic from '@/assets/img/background.png'
import axios from 'axios'
import { useNotiStore } from '@/store/notifications';
import { useAuthStore } from '@/store/auth';
import profile from '@/assets/img/profile.png'
import capName from '@/functions/capName';
import { storeToRefs } from 'pinia';
import { useSocketStore } from '@/store/socket';
import router from '@/router';
import { onMounted, watch } from 'vue';
const authStore = useAuthStore();
const notiStore = useNotiStore();
const { socket } = storeToRefs(useSocketStore())

const props = defineProps({
    userResponse: {
        type: Object,
        required: true
    }
})
const state = {
    newRequest: false,
    followIsLoading: false,
    followedByLoggedUser: props.userResponse.followedByLoggedUser,
    myProfile: ''
}
const handleFollowClick = () => {
    state.followIsLoading = true
    const followRequest = {
        sender: {
            _id: authStore._id,
            fname: authStore.fname,
            lname: authStore.lname,
            email: authStore.email,
        },
        receiverId: props.userResponse.user._id,
    }
    if (!state.followedByLoggedUser) {
        axios.post('connection/request', followRequest).then(res => {
            if (res && res.status === 201) {
                console.log('im here')
                socket.value.emitWithAck('followCreated',
                    {
                        sender: followRequest.sender,
                        receiverId: props.userResponse.user._id,
                        requestId: res && res.data.requestId
                    })
                    .then(res => {
                        if (res.status === 200) state.followedByLoggedUser = true
                        props.userResponse.followersCount++
                        socket.value.on('notification', (data) => {
                            notiStore.notificationsPush(data)
                        })
                        props.userResponse.followersCount++
                        state.newRequest = true
                    })
            }
            state.followIsLoading = false
        }).catch(err => {
            console.log('errorrrrrrr')
            console.log(err)
        })
    } else {
        console.log('im here')
        axios.post('connection/request', followRequest).then(res => {
            if (res && res.status === 204) {
                state.followedByLoggedUser = false
                props.userResponse.followersCount--
            }
            state.followIsLoading = false
        })
    }
}
console.log(props.userResponse)
onMounted(() => {
    if (props.userResponse.user._id === authStore._id) {
        state.myProfile = true
    } else {
        state.myProfile = false
    }
})
watch(router.currentRoute, (newRoute, oldRoute) => {
    // console.log({newRoute,oldRoute

    // })
    if (props.userResponse.user._id === authStore._id) {
        state.myProfile = true
    } else {
        state.myProfile = false
    }
})

</script>
<template>
    <div class="w-full flex justify-center mt-28">
        <div class="wrapper">
            <div class="background-container">
                <img :src="backgroundPic" />
            </div>
            <div class="flex justify-around items-center">
                <div class="relative">
                    <div class="details relative">
                        <div :class="`profile-pic-container ${state.myProfile ? 'my-profile' : ''}`">
                            <img v-if="userResponse.user.signedProfilePic" :src="userResponse.user.signedProfilePic" />
                            <img v-else :src="profile" />
                        </div>
                        <div class="font-bold text-xl">
                            <div class="name-container">
                                {{ capName(userResponse.user.fname) }}
                                {{ capName(userResponse.user.lname) }}
                            </div>
                            <div class="mt-2">@{{ userResponse.user.tag }}</div>
                        </div>
                    </div>
                </div>
                <div class="activity-container">
                    <div v-if="!state.followIsLoading && authStore._id != userResponse.user._id">
                        <button v-if="!state.followedByLoggedUser" @click="handleFollowClick"
                            class="button follow-button">Follow</button>
                        <button v-else @click="handleFollowClick" class="button follow-button">Following</button>
                    </div>
                    <div v-else>
                        <button class="button follow-button invisible">Follow</button>
                    </div>
                    <div class="flex">
                        <div class="flex text-lg">
                            <div class="pr-0.5">{{ userResponse.postCount }}</div>
                            <div> Posts</div>
                        </div>
                        <div class="flex text-lg">
                            <div class="pr-0.5">{{ userResponse.followersCount }}</div>
                            <div> Followers</div>
                        </div>
                        <div class="flex text-lg">
                            <div class="pr-0.5">{{ userResponse.followingCount }}</div>
                            <div> Following</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 50%;
    min-width: 625px;
    height: 60vh;
    min-height: 600px;
    border-radius: .25rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(105, 105, 105, 0.11);
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.295);
}

.details {
    display: flex;
    justify-content: center;
    align-items: center;
}

.my-profile:hover {
    width: 1000px;
}

.background-container {
    height: 25rem;
    display: flex;
    width: 100%;
    overflow: hidden;
    justify-content: center;
    align-items: center;

}

.activity-container {
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;

}

.name-container {
    font-weight: bold;
    font-size: 2rem;
    color: rgba(0, 0, 0, 0.541);
    white-space: no-wrap;
}

.activity-container> :nth-child(2) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.activity-container>div>* {
    margin: 1rem;
    font-weight: bold;
}


.activity-container>:first-child {
    display: flex;
    justify-content: flex-end;
}

.follow-button {
    font-weight: normal;
    color: black;
    outline: 1px solid rgba(0, 0, 0, 0.281);
    background-color: rgb(252, 252, 252);
    padding: .5rem 1rem;
}

@media only screen and (max-width: 1000px) {
    .wrapper {
        width: 100% !important;
    }
}
</style>