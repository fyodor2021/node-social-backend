<script setup>
import ContentUser from '@/components/ContentUser.vue';
import { onMounted, onUnmounted, reactive, watch, ref } from 'vue';
import axios from 'axios'
import { useAuthStore } from '@/store/auth';
// import Envelop from '~icons/fluent-emoji-flat/envelope';
import Envelop from '~icons/fluent-emoji-high-contrast/incoming-envelope?width=500px&height=300px'

const props = defineProps({
    handleSelectSearch: {
        type: Function
    },
    handleSelectUser: {
        type: Function
    },
    handleToggleChatSearch: {
        type: Function
    },
    message: {
        type: Object
    }
})
const authStore = useAuthStore();
const state = reactive({
    usersList: '',
    search: '',
    selectedUser: ''
})
const onSearchInput = () => {
    if (state.search) {
        axios
            .get('/search/' + state.search)
            .then(res => {
                state.usersList = res && res.data
            })
    } else {
        state.usersList = ''
    }
}
const handleSelectUser = (user) => {

    if (!props.message) {
        props.handleSelectUser(user)
        props.handleSelectSearch(user)
        props.handleToggleChatSearch()
    } else {
        state.selectedUser = user
    }
}
const handleSendPost = () => {
    if (state.selectedUser) {
        const {
            _id, fname, lname
        } = state.selectedUser
        const messageRequest = {
            sender: {
                _id: authStore._id,
                fname: authStore.fname,
                lname: authStore.lname,
            },
            receiver: {
                _id,
                fname,
                lname
            },
            content: props.message
        }
        axios.post('/message', messageRequest).then(() => {
            props.handleToggleChatSearch()
        })
    }
}
</script>

<template>
    <div class="c-s-container">
        <div class="wrapper" ref="chatSearch" v-click-outside="handleToggleChatSearch">
            <header class="title">
                New Message
            </header>
            <div>
                <input @input="onSearchInput" placeholder="Search" v-model="state.search"
                    class="search-input shadow-none rounded-none " />
            </div>
            <div :class="`user-list flex flex-col`">
                <ContentUser :isChatView="true" @click="handleSelectUser(user)" v-if="state.usersList"
                    :selected="state.selectedUser._id === user._id" v-for="user in state.usersList" :user="user"
                    :signedProfilePic="user.signedProfilePic" :key="user._id" />
                <div v-else class="w-full flex justify-start items-center flex-col">
                    <Envelop class="text-9xl text-gray-300" />
                    <div class="text-gray-500 font-bold text-2xl p-2">Let's start chatting!</div>
                </div>
            </div>
            <button v-if="message" @click="handleSendPost" class="button rounded-b-2xl w-full rounded-none">
                    Send
            </button>
        </div>
    </div>
</template>

<style scoped>
.c-s-container {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.301);
    position: fixed; 
    top: 0;
    left: 0;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.wrapper {
    width: 50%;
    height: 60%;
    box-shadow: 0px 0px 20px #00000073;
    border-radius: .5rem;
    border-radius: 1rem;
    
}

.title {
    background-color: white;
    font-weight: bold;
    width: 100%;
    display: flex;
    padding: .5rem;
    justify-content: center;
    border-bottom: 1px solid black;
    border-radius: 1rem 1rem 0 0;

}

.user-list {
    background-color: white;
    border-top: 1px solid black;
    overflow: auto;
    padding: 1rem;
    height: 100%;
    
}

.user-list::-webkit-scrollbar {
    display: none;
}


.user-list>img {
    width: 10px;

}

@media only screen and (max-width:1200px) {
    .wrapper {
        min-width: 600px;
    }
}
</style>