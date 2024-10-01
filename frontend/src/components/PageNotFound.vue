<script setup>
import { onMounted,ref } from 'vue';
import pageNotFound from '../assets/img/page-not-found.png'
const active = ref(false)
onMounted(() => {
    active.value = true
})
console.log(active)
</script>
<template>
    <div ref="page" class="p-n-f-container">
        <div class="wrapper">
            <img width="400px" :src="pageNotFound" alt="page not found"/>
        </div>
    </div>
</template>

<style scoped>

.p-n-f-container{
    height: 100vh;
    width: 100vw;
    position: fixed;
    background-color: black;
    z-index: 999;
}
.wrapper{
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: center;
}

</style>