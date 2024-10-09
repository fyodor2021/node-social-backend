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
            }).catch(error => {
                console.log(error)
            })
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
        })
})
</script>
<template>
    <div class="absolute top-[4rem] 3xl:top-[7rem] right-[6rem] h-[500px] overflow-auto f-s-container" ref="userList">
        <div class="text-lg text-gray-600 w-full">
           People you may know
        </div>
        <div v-for="userResponse in state.users" class="flex justify-between w-[400px] border-b-2">
            <ContentUser :user="userResponse" />
            <button class="button bg-white text-blue-300">Follow</button>
        </div>
    </div>
</template>
<style scoped>
.f-s-container::-webkit-scrollbar {
    display: none;
}
@media only screen and (max-width: 1630px ){
    .f-s-container {
    display: none;
}
}
</style>