<script setup>
import { reactive } from 'vue';
import profile from '@/assets/img/profile.png'
import EmojiPicker from 'vue3-emoji-picker'
import { useAuthStore } from '@/store/auth';
import 'vue3-emoji-picker/css'
import axios from 'axios'
import SmileFace from '~icons/ph/smiley-wink-thin'
const authStore = useAuthStore();

const props = defineProps({
    contentId: {
        type: String,
        required: true,
    },
    contentLength: {
        type: Number,
        default: 1
    },
    content: {
        type: String
    },
    setEditedComment:{
        type: Function
    },
    handleCreateComment:{
        type:Function
    },
    isPost:{
        type:Boolean,
        default: false,
    }
})

const state = reactive({
    input: props.content ? props.content: '',
    displayEmo: false,
    comments: []
})

const onSelectEmoji = (emoji) => {
    state.input = state.input + emoji.i
    state.displayEmo = false
}

const toggleDisplayEmoji = () => {
    state.displayEmo = !state.displayEmo
}


const handleEditComment = () => {
    const commentRequest = {
        user: {
            _id: authStore._id,
            fname: authStore.fname,
            lname: authStore.lname
        },
        commentId: props.contentId,
        content: state.input
    }
    axios.put('/comment', commentRequest).then(res => {
            if (res && res.status === 201) {
                props.setEditedComment(res.data)
            } 
        })
}
const handleTyping = () => {
    if(state.displayEmo){
        state.displayEmo = !state.displayEmo
    }
}
const createComment = () => {
    props.handleCreateComment(state.input, props.contentId)
    state.input = ''
}
</script>
<template>
    <div :class="`wrapper `">
        <div class="flex justify-center items-center w-full pr-1 pl-1">
            <i @click="toggleDisplayEmoji"><SmileFace class=" text-3xl text-black"/>
            </i>
            <textarea @input="handleTyping" v-model="state.input" type="text" class="input"
            placeholder="Add your comment..."></textarea>
        </div>
        <div class="flex justify-center items-center">
            <button @click="createComment" class="bg-white text-black p-2 rounded mr-4">Reply</button>
        </div>
        <div v-click-outside="() => state.displayEmo = false"  :class="`absolute top-0 cursor-pointer ${isPost? 'bottom-0 top-auto' : ''}`">
            <EmojiPicker v-if="state.displayEmo" :native="true" @select="onSelectEmoji"/>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(255, 254, 254);
}

.input {
    width: 100%;
    margin-top: 20px;
    margin-left: .25rem;
    height: auto;
    color: black;
    font-size: .90rem;
    resize: none;
}

.input:focus {
    outline: none;
}


</style>