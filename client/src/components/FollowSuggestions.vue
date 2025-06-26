<script setup>
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import ContentUser from './ContentUser.vue';

const state = reactive({
    users: []
})
const userList = ref(null)
const handleScroll = (e) => {
    if (userList.value.scrollTop + userList.value.clientHeight === userList.value.scrollHeight) {
        axios.get('/user/suggestions', { params: { offset: state.users.length } })
            .then(res => {
                if (res.status === 200) {
                    state.users = [...state.users, ...res.data]
                }
            }).catch((err) => {})
    }
}

onMounted(() => {
    axios.get('/user/suggestions', { params: { offset: 0 } })
        .then(res => {
            if (res && res.status === 200) {
                state.users = res && res.data
                setTimeout(() => {
                    userList.value.addEventListener('scroll', handleScroll)
                }, 1);
            }
        }).catch((err) => {})
})
</script>
<template>
    <div class=" h-[500px] w-full overflow-y-auto f-s-container xl:hidden" ref="userList">
        <div class="text-lg text-gray-600 w-full">
           People you may know
        </div>
        <div v-for="userResponse in state.users" class="flex  justify-between border-b-2">
            <div class="max-w-[80px] text-sm">
                <ContentUser :user="userResponse" />
            </div>
            <button class="button bg-white text-blue-300">Follow</button>
        </div>
    </div>
</template>
<style scoped>
.f-s-container::-webkit-scrollbar {
    display: none;
}
</style>