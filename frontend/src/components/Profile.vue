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
import { onMounted, watch, reactive } from 'vue';
import ProfilePicEdit from './ProfilePicEdit.vue';
import EditIcon from '~icons/ic/round-ios-share'
const authStore = useAuthStore();
const notiStore = useNotiStore();
const { socket } = storeToRefs(useSocketStore())

const props = defineProps({
    userResponse: {
        type: Object,
        required: true
    },
    toggleProfilePicEdit:{
        type: Function
    }
})
const state = reactive({
    followIsLoading: false,
    followedByLoggedUser: props.userResponse.followedByLoggedUser,
    myProfile: '',
    profilePicEdit: false
})
const handleFollowClick = () => {
    state.followIsLoading = true
    const followRequest = {
        sender: {
            _id: authStore._id,
            fname: authStore.fname,
            lname: authStore.lname,
            email: authStore.email,
        },
        receiver: {
            _id: props.userResponse.user._id,
            fname: props.userResponse.user.fname,
            lname: props.userResponse.user.lname,
            email: props.userResponse.user.email,
        },
    }

    axios
        .post('connection/request', followRequest)
        .then(async res => {
            switch(res && res.status){
                case 201:
                    socket.value.emit('followCreated', followRequest)
                    state.followedByLoggedUser = true
                    props.userResponse.followersCount++
                    break;
                case 204:
            }
            state.followIsLoading = false
        }).catch(err => {
            console.log('errorrrrrrr')
            console.log(err)
        })

}

const handleUnfollowClick = () => {
    const receiver = props.userResponse.user
    axios.delete('connection/', { params: { receiverId: receiver._id } }).then(res => {
        if (res && res.status === 204) {
            state.followedByLoggedUser = false
            props.userResponse.followersCount--
            socket.value.emit('followDeleted', {receiverId: receiver._id, senderId: authStore._id})
        }
        state.followIsLoading = false
    })
}
onMounted(() => {
    if (props.userResponse.user._id === authStore._id) {
        state.myProfile = true
    } else {
        state.myProfile = false
    }

})
watch(router.currentRoute, (newRoute, oldRoute) => {
    if (props.userResponse.user._id === authStore._id) {
        state.myProfile = true
    } else {
        state.myProfile = false
    }
})

</script>
<template>
    <div class="wrapper mt-28">
        <div class="background-container">
            <img :src="backgroundPic" />
        </div>
        <div class="d-wrapper">
            <div>
                <div class="details relative group ">
                    <div :class="`profile-pic-container w-32 h-32  ${state.myProfile ? 'my-profile' : ''}`">
                        <img v-if="userResponse.user.signedProfilePic" :src="userResponse.user.signedProfilePic" />
                        <img class="rounded-full" v-else :src="profile" />
                        <div v-if="userResponse.user._id === authStore._id" @click="toggleProfilePicEdit" class="absolute flex justify-center cursor-pointer items-center h-32 w-32 bg-gray-200 invisible rounded-full opacity-40 group-hover:visible text-3xl"><EditIcon/></div>
                    </div >
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
                    <button v-else @click="handleUnfollowClick" class="button follow-button">Following</button>
                </div>
                <div v-else>
                    <button class="button follow-button hidden">Follow</button>
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
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 300px;
    max-height: 60vh;
    max-width: 956px;
    margin: 0 auto;
    border-radius: .25rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(105, 105, 105, 0.11);
    box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.295);
}
.d-wrapper{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.details {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
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
    max-height: 200px;
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
@media only screen and (max-width: 720px){
    .d-wrapper{
        flex-direction: column;
    }
}
</style>