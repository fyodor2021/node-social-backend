<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useDisplayStore } from '@/store/display'
import axios from 'axios';
import ContentUser from '@/components/ContentUser.vue';
import router from '@/router';
const element = ref(null)
const displayStore = useDisplayStore();
const search = ref(null)
const state = reactive({
    users: ''
})
const onInput = () => {
    if (search.value) {
        axios.get('/search/' + search.value).then(res => {
            state.users = res.data
            console.log(res.data)
        })
    } else {
        state.users = ''
    }
}
const handleUserSelect = (user) => {
    router.push({ name: 'userDetails', params: { userId: user._id } })
    displayStore.toggleSearchView()
}
</script>
<template>
    <div class="container editor text-gray-800 border border-gray-300 p-4 shadow-lg ">
        <div class="wrapper" ref="element" v-click-outside="() => displayStore.toggleSearchView()">
            <input v-model="search" @input="onInput" class="search-input" spellcheck="false" placeholder="Search"
                type="text">
            <div class="user-list">
                <ContentUser v-if="state.users" @click="() => handleUserSelect(user)" v-for="user in state.users" :user="user"
                    :signedUserPic="user.signedUserPic" :key="user._id" />
            </div>
        </div>
    </div>
</template>
<style scoped>
.container {
    position: fixed;
    max-width: 100vw;
    height: 100vh;
    z-index: 9999;
    top: 0;
    background-color: rgba(0, 0, 0, 0.411);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    border: none;
}

.wrapper {
    display: flex;
    width: 40%;
    height: fit-content;
    flex-direction: column;
    align-items: center;
    background-color: rgb(255, 255, 255);
    outline: 1px solid rgba(0, 0, 0, 0.144);
    border-radius: .5rem;

}



.input:focus {
    outline: none;
}

.user-list {
    background-color: white;
    position: fixed;
    top: 8rem;
    width: 40%;
    box-shadow: 0px 0px 20px 0px black;
    border-radius: 1rem;
}

.user-list>* {
    margin: .5rem;
    font-size: 1.5rem;

}

.user-list>div> :first-child>img {
    width: 6rem !important;
}
</style>