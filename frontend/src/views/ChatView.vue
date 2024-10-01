<script setup>
import { useAuthStore } from '@/store/auth';
import { useSocketStore } from '@/store/socket';
import { storeToRefs } from 'pinia';
import { onBeforeMount, reactive, watch, onBeforeUnmount, onMounted, ref, nextTick } from 'vue';
import axios from 'axios'
import ContentUser from '@/components/ContentUser.vue';
import Message from '@/components/Message.vue'
import { useDisplayStore } from '@/store/display';
import capName from '@/functions/capName';
import ChatSearchView from './ChatSearchView.vue';
import Loader from '@/components/Loader.vue';
import MessageList from '@/components/MessageList.vue';
const socketStore = useSocketStore();
const { socket } = storeToRefs(socketStore)
const displayStore = useDisplayStore()
const authStore = useAuthStore();
const chatBox = ref(null)
const message = ref(null)
const displaySearch = ref(false)
const state = reactive({
    input: '',
    search: '',
    users: '',
    selectedUser: '',
    messages: [],
    usersList: '',
    userIdSet: new Set(),
    isLoading: false,
})

const handleMessageSubmit = async () => {
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
            content: state.input
        }
        axios.post('/message', messageRequest).then(res => {
            socket.value.emitWithAck('newMessage', { senderId: authStore._id, receiverId: state.selectedUser._id }).then(res => {
                if (res && res.status === 200) {

                }
            })
        })
    }
}
const handleSelectSearch = (user) => {
    const userIdSet = new Set(state.userIdSet)
    if (!userIdSet.has(user._id)) {
        state.userIdSet = userIdSet.add(user._id)
        state.usersList = [...state.usersList, user]
    }
    state.selectedUser = user
    state.users = ''
    state.search = ''
}

const handleSelectUser = (user) => {
    state.selectedUser = user
    axios.get('/message', { params: { selectedUserId: user._id, offset: 0 } })
        .then(res => {
            state.messages = res && res.data
            socketStore.newMessageAlertSet.delete(user._id)
        })
}

const handleToggleChatSearch = () => {
    displaySearch.value = !displaySearch.value
}
const chatScrollUp = (e) => {
    if ((chatBox.value.scrollTop * - 1) + chatBox.value.clientHeight === chatBox.value.scrollHeight) {
        axios.get('/message', { params: { selectedUserId: state.selectedUser._id, offset: state.messages.length } })
            .then(res => {
                state.messages = res && [...state.messages, ...res.data,]
            })
    }
}

onMounted(async () => {
    axios.get('message/convo', { params: {} })
        .then(res => {
            state.usersList = res && res.data
            for (let user of state.usersList) {
                state.userIdSet.add(user._id)
            }
            socketStore.setUpInitialConnectionBundleEmitter(Array.from(state.userIdSet))
            state.selectedUser = state.usersList[0]
            if (state.selectedUser) {
                axios.get('/message', { params: { selectedUserId: state.selectedUser._id, offset: 0 } })
                    .then(res => {
                        state.messages = res.data
                    })
            }
        })
    displayStore.toggleSidePanel();
    chatBox.value.addEventListener('scroll', chatScrollUp)
    setTimeout(() => {
        chatBox.value.scrollTop = chatBox.value.scrollHeight
    }, 100);

    socket.value.on('message', (data) => {
        if ((state.selectedUser._id === data.message.sender._id) || (data.message.sender._id === authStore._id)) {
            state.messages = [data.message, ...state.messages]
        } else {
            for (let user in state.usersList) {
                if (user._id === data.message.sender._id) {
                    console.log('im here')
                }
            }
        }
    })
})

onBeforeUnmount(() => {
    chatBox.value.removeEventListener('scroll', chatScrollUp)
    displayStore.toggleSidePanel();
})


</script>
<template>
    <div class="container">
        <div class="side-wrapper">
            <div class="name-search-container">
                <div>
                    <div>{{ capName(authStore.fname) }}{{ capName(authStore.lname) }}</div>
                </div>
                <i class="pi pi-pen-to-square" @click="handleToggleChatSearch"></i>
            </div>
            <div class="chat-user-list">
                <ContentUser :isChatView="true" @click="handleSelectUser(user)"
                    :selected="state.selectedUser._id === user._id" v-if="state.usersList"
                    v-for="user in state.usersList" :user="user" :signedProfilePic="user.signedProfilePic"
                    :key="user._id" :newMessage="socketStore.newMessageAlertSet.has(user._id)" />
            </div>
        </div>
        <div class="chat-box relative mt-28">
            <div class="selected-user">
                <ContentUser v-if="state.selectedUser" :isChatView="true" :user="state.selectedUser"
                    :isOnline='socketStore.connectedUsers.has(state.selectedUser._id)'
                    :signedProfilePic="state.selectedUser.signedProfilePic ? state.selectedUser.signedProfilePic : ''" />
            </div>
            <div class="message-list-wrapper" ref="chatBox">
                <MessageList :messages="state.messages"
                    :signedProfilePic="state.selectedUser && state.selectedUser.signedProfilePic ? state.selectedUser.signedProfilePic : ''" />
            </div>
            <form @submit.prevent="handleMessageSubmit" class="flex items-center justify-center w-full p-8
            border-gray-400 focus:outline-none 
                        focus:border-blue-500">
                <input v-model="state.input" type="text" placeholder="Type a message..."
                    class="w-full p-2 m-2 rounded-md border">
                <button class="button">Send</button>
            </form>
        </div>
    </div>
    <div v-if="displaySearch">
        <ChatSearchView :handleSelectSearch="handleSelectSearch" :handleSelectUser="handleSelectUser"
            :handleToggleChatSearch="handleToggleChatSearch" />
    </div>
</template>

<style scoped>
.container {
    max-width: 100vw;
    display: flex;
    justify-content: center;
    flex-direction: row;
    position: relative;
    height: 100vh;
}

.side-wrapper {
    width: 24%;
    background-color: black;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    position: relative;
    padding: 1rem;
}

.wrapper {
    display: flex;
    margin-right: .75rem;
}

.user-search-results {
    position: absolute;
    top: 10rem;
}

.name-search-container {
    display: flex;
    color: white;
    justify-content: space-between;
    width: 100%;
    font-size: 1.5rem;
    padding: 10px;
}

.chat-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1 1 0%;
    overflow: auto;
}

.message-list-wrapper {
    display: flex;
    width: 100%;
    flex-direction: column-reverse;
    padding: 2rem;
    overflow: auto;
    overflow-anchor: none;
    flex: 1 1 0%;
    position: sticky;
    background-color: rgba(129, 129, 129, 0.123);
}

.selected-user {
    background-color: black;
    color: white;
    font-size: 1.5rem;
    width: 100%;
}

/* .message-list-wrapper::-webkit-scrollbar{
    display: none;
} */
@media only screen and (max-width: 1520px) {
    .container {
        display: flex;
        flex-direction: column;

    }

    .side-wrapper {
        width: 100%;
        height: 126px;
        padding: 0.5rem;
        margin-bottom: .25rem;
        margin-top: 115px;

    }

    .chat-user-list {
        padding: 0;
    }

    .chat-user-list>* {
        padding: 0 !important;
    }

    .chat-box {
        margin-top: 0 !important
    }

    .name-search-container {
        font-size: 1rem;
        padding: 0;
        padding-bottom: .10rem;
    }
}
</style>
