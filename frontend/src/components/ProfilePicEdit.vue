<script setup>
import { reactive } from 'vue';
import axios from 'axios'
import { useAuthStore } from '@/store/auth';
import { useValMessageStore } from '@/store/valMessage';
import router from '@/router';
import TrashBinIcon from '~icons/material-symbols/delete-outline'
import UploadIcon from '~icons/solar/upload-minimalistic-linear'
const props = defineProps({
    toggleFunction: {
        type: Function,
        required: true
    },

})
const state = reactive({
    uploadedImage: '',
    uploadedImageFile: '',
})
const authStore = useAuthStore();
const valMessageStore = useValMessageStore();
const handleEditSubmit = () => {
    const formData = new FormData();
    const userRequest = {
        userId: authStore._id,
        imageRemoved: state.imageRemoved
    }
    formData.append('data', JSON.stringify(userRequest))
    if (state.uploadedImage) {
        if (state.uploadedImage) {
            formData.append('image', state.uploadedImageFile)
        }
    }
    axios.put('/user/profile/pic', formData, {
        headers: {
            "Content-Type": `multipart/form-data`
        }
    }).then(res => {
        if (res.status === 201) {
            router.go('/')
        }
    }).catch(error => {
        valMessageStore.setValMessage('Please tell us more...')
        return
    })
}
const handleFileUpload = (e) => {
    state.uploadedImageFile = e.target.files[0]
    const reader = new FileReader();
    reader.onload = (e) => {
        state.uploadedImage = e.target.result
    }
    reader.readAsDataURL(e.target.files[0])
}
const removeUploadedImage = () => {
    state.uploadedImageFile = ''
    state.uploadedImage = ''
}
</script>
<template>
    <div class="p-p-container">
        <form @submit.prevent="handleEditSubmit" enctype="multipart/form-data" ref="element"
            v-click-outside="toggleFunction">
            <div v-if="!state.uploadedImage"
                class="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center">
                <div class="px-4 py-6">
                    <div id="image-preview"
                        class="max-w-sm p-6 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center  mx-auto text-center cursor-pointer">
                        <input id="file-upload" type="file" class="hidden" accept="image/*"
                            @change="handleFileUpload" />
                        <label for="file-upload" class="cursor-pointer">
                            <div class="text-4xl opacity-60 w-8 h-8 text-gray-700 mx-auto mb-4">
                                <UploadIcon/>
                            </div>

                            <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-700">Upload picture</h5>
                            <p class="font-normal text-sm text-gray-400 md:px-6">Choose photo size should be less than
                                <b class="text-gray-600">2mb</b>
                            </p>
                            <p class="font-normal text-sm text-gray-400 md:px-6">and should be in <b
                                    class="text-gray-600">JPG, PNG, or GIF</b> format.</p>
                        </label>
                    </div>
                </div>
            </div>
            <div v-else class="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center">
                <div class="px-4 py-6">
                    <div id="image-preview"
                        class="p-6 mb-4  bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                        <div class="max-w-sm group w-[250px] relative h-[250px] rounded-full overflow-hidden flex justify-center items-center">
                            <img class=" h-full" :src="state.uploadedImage" />
                            <div class="w-[250px] h-[250px] absolute bg-gray-200 opacity-40 invisible group-hover:visible flex justify-center items-center text-4xl" 
                            @click="removeUploadedImage">
                                <TrashBinIcon/>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-center">
                        <div class="w-full">
                            <button type="submit"
                                class="w-full text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2 cursor-pointer">
                                Upload</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    </div>
</template>
<style scoped>
.p-p-container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999;
    background-color: rgba(0, 0, 0, 0.308);
    display: flex;
    justify-content: center;
    align-items: center;
}


.upload-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>