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
import SidePanel from '@/components/SidePanel.vue';
import EmojiPicker from 'vue3-emoji-picker'
import SmileFace from '~icons/ph/smiley-wink-thin'

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
    displayEmo: false,
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
            socket.value.emit('newMessage', { senderId: authStore._id, receiverId: state.selectedUser._id })
        }).catch((err) => {})
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
    socketStore.setUpUserOnlineStatusCheck(user._id)
}

const handleSelectUser = (user) => {
    state.selectedUser = user
    axios.get('/message', { params: { selectedUserId: user._id, offset: 0 } })
        .then(res => {
            state.messages = res && res.data
            socketStore.newMessageAlertSet.delete(user._id)
        }).catch((err) => {})
}

const handleToggleChatSearch = () => {
    displaySearch.value = !displaySearch.value
}
const chatScrollUp = (e) => {
    if ((chatBox.value.scrollTop * - 1) + chatBox.value.clientHeight === chatBox.value.scrollHeight) {
        axios.get('/message', { params: { selectedUserId: state.selectedUser._id, offset: state.messages.length } })
            .then(res => {
                state.messages = res && [...state.messages, ...res.data,]
            }).catch((err) => {})
    }
}
const onSelectEmoji = (emoji) => {
    state.input = state.input + emoji.i
    state.displayEmo = false
}

const toggleDisplayEmoji = () => {
    state.displayEmo = !state.displayEmo
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
        }).catch((err) => {})
    chatBox.value.addEventListener('scroll', chatScrollUp)
    setTimeout(() => {
        chatBox.value.scrollTop = chatBox.value.scrollHeight
    }, 100);
    socket.value.on('message', (data) => {
        if ((state.selectedUser._id === data.message.sender._id) || (data.message.sender._id === authStore._id)) {
            state.messages = [data.message, ...state.messages]
            state.input = ''
        } else {
            for (let user in state.usersList) {
                if (user._id === data.message.sender._id) {
                }
            }
        }
    })
})

onBeforeUnmount(() => {
    chatBox.value.removeEventListener('scroll', chatScrollUp)
})


</script>
<template>
    <div class="flex ">
        <div class="c-container">
            <div class="side-wrapper">
                <div class="name-search-container">
                    <div>
                        <div>{{ capName(authStore.fname) }} {{ capName(authStore.lname) }}</div>
                    </div>
                    <i class="pi pi-pen-to-square" @click="handleToggleChatSearch"></i>
                </div>
                <div class="chat-user-list" >
                    <div v-for="user in state.usersList" :class="`${state.selectedUser._id === user._id ? 'bg-black': ''}`">
                        <ContentUser :isChatView="true" @click="handleSelectUser(user)"
                             v-if="state.usersList"
                             :user="user" :signedProfilePic="user.signedProfilePic"
                            :key="user._id" :newMessage="socketStore.newMessageAlertSet.has(user._id)" />
                    </div>
                </div>
            </div>
            <div class="chat-box">
                <div class="selected-user">
                    <ContentUser v-if="state.selectedUser" :isChatView="true" :user="state.selectedUser"
                        :isOnline='socketStore.connectedUsers.has(state.selectedUser._id)'
                        :signedProfilePic="state.selectedUser.signedProfilePic ? state.selectedUser.signedProfilePic : ''" />
                </div>
                <div class="message-list-wrapper" ref="chatBox">
                    <MessageList :messages="state.messages"
                        :signedProfilePic="state.selectedUser && state.selectedUser.signedProfilePic ? state.selectedUser.signedProfilePic : ''" />
                </div>
            </div>
            <form @submit.prevent="handleMessageSubmit" class="flex items-center justify-center w-full p-8 relative
                border-gray-400 focus:outline-none 
                            focus:border-blue-500">
                    <i @click="toggleDisplayEmoji">
                        <SmileFace class=" text-3xl text-black" />
                    </i>
                    <div v-click-outside="() => state.displayEmo = false"
                        :class="`absolute cursor-pointer bottom-0 top-auto left-0`">
                        <EmojiPicker v-if="state.displayEmo" :native="true" @select="onSelectEmoji" />
                    </div>
                    <input v-model="state.input" type="text" placeholder="Type a message..."
                        class="w-full p-2 m-2 rounded-md border">
                    <button v-if="state.input" class="button" type="submit">Send</button>
                    <button v-else class="button bg-gray-300" disabled>Send</button>
                </form>
        </div>
        <div v-if="displaySearch">
            <ChatSearchView :handleSelectSearch="handleSelectSearch" :handleSelectUser="handleSelectUser"
                :handleToggleChatSearch="handleToggleChatSearch" />
        </div>
    </div>
</template>

<style scoped>
.c-container {
    width: calc(100% - 350px);
    display: flex;
    margin-left: auto;
    height: 100vh;
}

.side-wrapper {
    width: 100%;
    background-color: black;
    padding: 0.5rem;
    margin-bottom: .25rem;
}

.wrapper {
    display: flex;
    margin-right: .75rem;
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
    height: 100%;
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

.chat-user-list {
    display: flex;
    flex-direction: row;
    max-width: 76vw;
    overflow-x: auto;
    overflow-y: hidden;
    padding: .5rem;
    height: 100px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.chat-user-list>* {
    color: white;
    width: 250px;
    height: 80px;
    background-color: rgba(102, 102, 102, 0.185);
    border-radius: 0.5rem;
    margin: 0.25rem 0.5rem;

}



.c-container {
    display: flex;
    flex-direction: column;

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
@media only screen and (max-width: 1550px) {
    .c-container {
        width: calc(100% - 110px);
    }
}
@media only screen and (max-width: 1300px) {
    .c-container {
        margin: 0;
        margin-top: 112px;
        width: 100vw;
        height: calc(100vh - 112px);
    }

    .chat-user-list {
        max-width: 100vw;
    }

}

</style>
