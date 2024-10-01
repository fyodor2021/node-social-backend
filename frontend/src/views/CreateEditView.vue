<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useDisplayStore } from '@/store/display'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { useValMessageStore } from '@/store/valMessage';
import axios from 'axios'
import ContentUser from '@/components/ContentUser.vue';
import Post from '@/components/Post.vue'
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
    }

})
const state = reactive({
    uploadedImage: props.postResponse && props.postResponse.signedPostPic ? props.postResponse.signedPostPic : '',
    uploadedImageFile: null,
    displayEmo: false,
    input: props.postResponse && props.postResponse.post.content ? props.isShare ? '' : props.postResponse.post.content : '',
    imageRemoved: false
})

const handleCancelClick = () => {
    if (props.postResponse) {
        props.toggleEdit()
    } else {
        displayStore.toggleCreateView()

    }
}
const handleFileUpload = (e) => {
    state.uploadedImageFile = e.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
        state.uploadedImage = e.target.result
    }
    reader.readAsDataURL(e.target.files[0])
}
const toggleDisplayEmoji = () => {
    state.displayEmo = !state.displayEmo
}
const onSelectEmoji = (emoji) => {
    state.input = state.input + emoji.i
    state.displayEmo = false
}
const handleSubmitPost = (e) => {
    if (!state.input && !state.uploadedImage) {
        valMessageStore.setValMessage('Please tell us more...')
        return
    }
    const formData = new FormData();
    const postRequest = {
        user: {
            _id: authStore._id,
            fname: authStore.fname,
            lname: authStore.lname,
            email: authStore.email,
        },
        content: state.input,
        postId: props.postResponse ? props.postResponse.post._id : '',
        imageRemoved: state.imageRemoved
    }
    formData.append('post', JSON.stringify(postRequest))
    if (state.uploadedImage) {
        if (state.uploadedImage) {
            formData.append('image', state.uploadedImageFile)
        }
    }
    if (props.postResponse) {
        axios.put('/post', formData, {
            headers: {
                'Content-Type': " multipart/form-data"
            }
        }).then(res => {
            console.log(res)
            if (res && res.status === 204) {
                console.log(res)
            } else if (res && res.status == 200) {
                props.toggleEdit()
            }
        })
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
const handleImageRemove = () => {
    state.uploadedImage = ''
    state.imageRemoved = true
}

</script>
<template>
    <div class="c-e-container text-gray-800 border border-gray-300 p-4 shadow-lg ">
        <form @submit.prevent="handleSubmitPost" enctype="multipart/form-data" class="wrapper" ref="element"
            v-click-outside="toggleFunction">
            <ContentUser />
            <div class="relative">
                <div class="upload-container">
                    <div v-if="!isShare">
                        <input id="file-upload" name="image" type="file" @change="handleFileUpload" accept="image/*">
                        <label for="file-upload" class="file-upload-label"><i @click="handleAttachClick"
                                class="pi pi-paperclip text-3xl m-4"></i></label>
                    </div>
                    <button @click="toggleDisplayEmoji" :class="`pi pi-face-smile text-3xl`">
                    </button>
                </div>
                <div class="emoji-wrapper cursor-pointer">
                    <EmojiPicker v-if="state.displayEmo" :native="true" @select="onSelectEmoji" />
                </div>
                <div class="text-pink-500">{{ valMessageStore.valMessage }}</div>
            </div>
            <div class="flex flex-col justify-space-between">
                <textarea v-model="state.input" class="input post-body" placeholder="What's on your mind...">
                </textarea>
                <div v-if="!isShare">
                    <div>
                        <div v-if="state.uploadedImage" class="relative">
                            <img class="opacity-35" :src="state.uploadedImage" />
                            <button @click="handleImageRemove" class="remove-button">remove</button>
                        </div>
                        <div v-else class="w-full flex justify-center">
                            <img v-if="postResponse && postResponse.signedPostPic && state.uploadedImage"
                                :src="postResponse && postResponse.signedPostPic" rel="preload" />
                            <span v-else>Upload an image, it will make you post brighter!</span>
                        </div>
                    </div>
                    <div class="buttons flex justify-end align-center m-2">
                        <div>
                            <button @click="handleCancelClick" class="button mr-1">Cancel</button>
                            <button type="submit" class="button">
                                {{ postResponse ?
                                    'Edit' : 'Post' }}</button>
                        </div>
                    </div>
                </div>
                <div v-if="postResponse">

                    <Post :postResponse="postResponse" :isShare="isShare" />
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
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    border: none;
}

.wrapper {
    display: flex;
    width:800px;
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
    border-bottom: 1px solid rgba(44, 44, 44, 0.185);
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