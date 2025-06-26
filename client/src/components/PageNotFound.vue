<script setup>
import { onMounted, ref } from 'vue';
import pageNotFound from '../assets/img/page-not-found.png'
import router from '@/router';
import Gohome from '@/assets/img/go-home.png'
const active = ref(false)
onMounted(() => {
    active.value = true
})
</script>
<template>
    <div ref="page" class="p-n-f-container">
        <div class="wrapper">
            <img width="400px" :src="pageNotFound" alt="page not found" />
            <button class="w-[300px]" alt="go home" @click="() => router.push('/')"><img :src="Gohome" /></button>
        </div>
    </div>
</template>

<style scoped>
.p-n-f-container {
    height: 100vh;
    width: 100vw;
    position: fixed;
    background-color: black;
    z-index: 999;
}

.wrapper {
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
</style>