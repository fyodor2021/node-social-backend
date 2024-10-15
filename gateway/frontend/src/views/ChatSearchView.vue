<script setup>
import ContentUser from '@/components/ContentUser.vue';
import { onMounted, onUnmounted, reactive, watch, ref } from 'vue';
import axios from 'axios'
import { useAuthStore } from '@/store/auth';
// import Envelop from '~icons/fluent-emoji-flat/envelope';
import Envelop from '~icons/fluent-emoji-high-contrast/incoming-envelope?width=500px&height=300px'
import { useSocketStore } from '@/store/socket';
import { storeToRefs } from 'pinia';

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
    },
    isProfile: {
        type: Boolean,
        default: false,
    },
    usersList: {
        type: Array,
        default: []
    }

})
const authStore = useAuthStore();
const socketStore = useSocketStore();
const { socket } = storeToRefs(socketStore)
const state = reactive({
    usersList: props.usersList.length > 0 ? props.usersList : [],
    search: '',
    selectedUser: '',
})
const onSearchInput = () => {
    if (!props.isProfile) {
        if (state.search) {
            axios
                .get('/search/' + state.search)
                .then(res => {
                    state.usersList = res && res.data
                }).catch((err) => { })
        } else {
            state.usersList = ''
        }
    } else {

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
            content: {
                _id: props.message._id,
                date: props.message.date,
                fileName: props.message.fileName,
                modified: props.message.modified,
                status: props.message.status,
                strContent: props.message.strContent,
                objContent: props.message.objContent,
                user: props.message.user
            }
        }
        axios.post('/message', messageRequest).then(() => {
            props.handleToggleChatSearch()
            socket.value.emit('newMessage', { senderId: authStore._id, receiverId: state.selectedUser._id })
        })
    }
}
</script>
<template>
    <div class="c-s-container">
        <div class="wrapper" ref="chatSearch" v-click-outside="handleToggleChatSearch">
            <div>
                <header class="title">
                    New Message
                </header>
                <div>
                    <input @input="onSearchInput" placeholder="Search" v-model="state.search"
                        class="search-input shadow-none rounded-none " />
                </div>
            </div>
            <div :class="`user-list flex flex-col flex ${!message ? 'rounded-b-2xl' : ''}`">
                <div v-if="state.usersList.length > 0" v-for="user in state.usersList" class="h-20">
                    <ContentUser :isChatView="true" @click="handleSelectUser(user)"
                        :selected="state.selectedUser._id === user._id" :user="user" :key="user._id" />
                </div>
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