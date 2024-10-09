<script setup>
import { useAuthStore } from '@/store/auth';

defineProps({
    contentResponse: {
        type: Object,
        required: true
    },
    deleteContent: {
        type: Function
    },
    editContent: {
        type: Function
    },
    displayOptions: {
        type: Boolean
    },
    toggleOptions: {
        type: Function
    }
})
const authStore = useAuthStore();
</script>
<template>
    <div v-if="contentResponse.object.user._id === authStore._id" 
        class="flex justify-between p-2 items-center z-[9]">
        <div class="flex justify-end items-center pr-6 relative">
            <i class="pi pi-ellipsis-v text-2xl text-gray-400">
            </i>
            <div v-if="displayOptions" v-click-outside="toggleOptions" class="options-container">
                <div class="triangle border-b-white mr-4"></div>
                <div class="bg-[#f0f0f0d8] p-2 rounded-xl">
                    <div class="crud-item" @click="deleteContent">
                        <div class="w-full pt-1 pb-1 pr-2 pl-2 cursor-pointer flex items-center">
                            <i class="pi pi-times-circle mr-2 text-red-500"></i><span>Delete</span>
                        </div>
                    </div>
                    <div class="crud-item" @click="editContent">
                        <div class="w-full pt-1 pb-1 pr-2 pl-2 cursor-pointer flex items-center">
                            <i class="pi pi-pen-to-square mr-2 text-green-500"></i><span>Edit</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.options-container{
    padding: .5rem;
    position: absolute;
    top: 2rem;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    flex-direction: column;
}

.crud-item {
    background-color: #ffffff;
    color: black;
    padding: .25rem;
    margin:.25rem;
    border-radius: .25rem;
}
</style>
