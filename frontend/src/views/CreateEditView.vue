<script setup>
import { onBeforeUnmount, onMounted, onUnmounted, onUpdated, reactive, ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useDisplayStore } from '@/store/display'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { useValMessageStore } from '@/store/valMessage';
import axios from 'axios'
import ContentUser from '@/components/ContentUser.vue';
import Post from '@/components/Post.vue'
import TrashBinIcon from '~icons/material-symbols/delete-outline'

const authStore = useAuthStore();
const valMessageStore = useValMessageStore();
const element = ref(null)
const displayStore = useDisplayStore();
const props = defineProps({
    postResponse: {
        type: Object
    },
    toggleFunction: {
        type: Function,
        default: () => {
            const displayStore = useDisplayStore();
            displayStore.toggleCreateView();
        }
    },
    isShare: {
        type: Boolean,
        default: false,
    },


})
const state = reactive({
    uploadedImage: props.postResponse && props.postResponse.signedPostPic ? props.postResponse.signedPostPic : '',
    uploadedImageFile: null,
    displayEmo: false,
    input: props.postResponse && props.postResponse.object.strContent ? props.isShare ? '' : props.postResponse.object.strContent : '',
    inputLetterCount: 0,
    valMessage: ''
})

const handleCancelClick = () => {
    if (props.postResponse) {
        props.toggleFunction()
    } else {
        displayStore.toggleCreateView()

    }
}
const handleFileUpload = (e) => {
    console.log('im here', e.target.files)
    state.uploadedImageFile = e.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
        state.uploadedImage = e.target.result
        console.log(e.target.result)
    }
    reader.readAsDataURL(e.target.files[0])
}
const toggleDisplayEmoji = () => {
    state.displayEmo = !state.displayEmo
}
const onSelectEmoji = (emoji) => {
    state.input = state.input + emoji.i
}
const handleSubmitPost = (e) => {
    if ((!state.input || !state.uploadedImage) && !props.postResponse) {
        if (!state.input) {
            state.valMessage = 'Please tell us more...'
            return
        } else {
            state.valMessage = 'Upload a pic it will make your post brighter!'
            return
        }
    }
    const formData = new FormData();
    const postRequest = {
        user: {
            _id: authStore._id,
            fname: authStore.fname,
            lname: authStore.lname,
            email: authStore.email,
        },
        strContent: state.input,
        postId: props.postResponse ? props.postResponse.object._id : '',
    }
    formData.append('post', JSON.stringify(postRequest))
    if (state.uploadedImage) {
        if (state.uploadedImage) {
            formData.append('image', state.uploadedImageFile)
        }
    }
    if (props.postResponse) {
        if (props.isShare) {
            const postRequest = {
                user: {
                    _id: authStore._id,
                    fname: authStore.fname,
                    lname: authStore.lname,
                    email: authStore.email
                },
                strContent: state.input,
                objContent: {
                    _id: props.postResponse.object._id,
                    user: props.postResponse.object.user,
                    strContent: props.postResponse.object.strContent,
                    fileName: props.postResponse.object.fileName,
                    objContent: props.postResponse.object.objContent ?
                        props.postResponse.object.objContent.object : ''
                },
            }
            axios.post('/post/share', postRequest).then(res => {
                if (res && res.status === 201) {
                    props.toggleFunction()
                } else if (res && res.status == 200) {
                    props.toggleFunction()
                }
            })
        } else {
        if(!state.uploadedImage && state.input === props.postResponse.object.strContent){
            props.toggleFunction()
        }else{
            axios.put('/post', formData, {
                headers: {
                    'Content-Type': " multipart/form-data"
                }
            }).then(res => {
                console.log(res)
                if (res && res.status === 201) {
                    props.toggleFunction()
                } else if (res && res.status == 200) {
                    props.toggleFunction()
                }
            })
        }
        }
    } else {
        axios.post('/post', formData, {
            headers: {
                "Content-Type": `multipart/form-data`
            }
        }).then(res => {
            if (res.status === 201) {
                window.location.reload();
            }
        }).catch(error => {
            valMessageStore.setValMessage('Please tell us more...')
            return
        })
    }
}
const handleInput = () => {
    if (state.input.length >= 400) {
        state.input = state.input.slice(0, 400)
        state.inputLetterCount = 400
    } else {
        state.inputLetterCount = state.input.length
    }
}
const handleRemoveUploadedImage = () => {
    state.uploadedImage = ''
    state.uploadedImageFile = ''
}
onUpdated(() => {
})
</script>
<template>
    <div class="c-e-container text-gray-800 border border-gray-300 p-4 shadow-lg ">
        <form @submit.prevent="handleSubmitPost" enctype="multipart/form-data" class="wrapper" ref="element"
            v-click-outside="toggleFunction">
            <!-- this is the create area -->
            <div class="flex w-full justify-between items-center">
                <div>
                    <ContentUser />
                </div>
                <div class="relative">
                    <div class="upload-container">
                        <div v-if="!isShare && !postResponse">
                            <input id="file-upload" name="image" type="file" @change="handleFileUpload"
                                accept="image/*">
                            <label for="file-upload" class="file-upload-label"><i @click="handleAttachClick"
                                    class="pi pi-paperclip text-3xl mr-4"></i></label>
                        </div>
                        <i v-click-outside="() => state.displayEmo = false" @click="toggleDisplayEmoji" :native="true"
                            :class="`pi pi-face-smile text-3xl`">
                        </i>
                    </div>
                    <div v-if="state.displayEmo" class="emoji-wrapper cursor-pointer">
                        <EmojiPicker  v-click-outside="() => state.displayEmo = false" v-if="state.displayEmo" @select="onSelectEmoji" />
                    </div>
                    <div class="text-pink-500">{{ state.valMessage }}</div>
                </div>
            </div>
            <div class="flex flex-col justify-space-between">
                <!-- this is the Edit / share area -->
                <div class="border-b-[1px] border-[rgba(44,44,44,0.185)] flex flex-col">
                    <textarea v-model="state.input" @input="handleInput" class="input post-body"
                        placeholder="What's on your mind...">
                     </textarea>
                    <div class="w-full flex justify-end">
                        {{ state.inputLetterCount }}/400
                    </div>
                </div>
                <div v-if="(postResponse && isShare) || postResponse && postResponse.object.objContent">
                    <Post :postResponse="postResponse" :isShare="true" />
                </div>
                <div v-else class="w-full flex justify-center items-center p-4 relative group">
                    <img v-if="state.uploadedImage || (postResponse && !isShare)"
                        :src="state.uploadedImage ? state.uploadedImage : postResponse.object.signedPostPic"
                        class="w-full h-full" />
                    <div v-else>Josedor team believes that a picture is worth a thousand words</div>
                    <div v-if="state.uploadedImage" @click="handleRemoveUploadedImage"
                        class="w-full h-full absolute bg-black 
                    flex justify-center items-center text-[5rem] opacity-60 invisible group-hover:visible">
                        <TrashBinIcon />
                    </div>
                </div>
                <div class="buttons flex justify-end align-center m-2">
                    <div>
                        <button @click="handleCancelClick" class="button mr-1">Cancel</button>
                        <button type="submit" class="button">
                            {{ postResponse && isShare ? 'Share' : postResponse ? 'edit' : 'Create' }}</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>
<style scoped>
.c-e-container {
    position: fixed;
    height: 100vh;
    width: 100vw;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.411);
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    border: none;
}

.wrapper {
    display: flex;
    width: 800px;
    height: 80%;
    flex-direction: column;
    background-color: rgb(255, 255, 255);
    outline: 1px solid rgba(0, 0, 0, 0.144);
    padding: 4rem;
    border-radius: 1rem;
    box-shadow: 0px 0px 20px 0px black;
    overflow: auto;
}

.wrapper::-webkit-scrollbar {
    display: none;
}

.upload-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.input {
    padding: 1rem;
}

.post-body {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    resize: none;
    margin-bottom: 1rem;
}

.post-body::-webkit-scrollbar {
    display: none;
}

.post-body:focus {
    outline: none;
}

input[type="file"] {
    display: none;
}

.emoji-wrapper {
    position: absolute;
    right: 0rem;
    top: 4rem;
    z-index: 999999;
}

.remove-button {
    position: absolute;
    background-color: rgba(155, 155, 155, 0.384);
    opacity: 1;
    color: rgb(255, 255, 255);
    padding: 1rem;
    border-radius: 1rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

}
</style>