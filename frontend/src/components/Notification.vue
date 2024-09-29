<script setup>
import profile from '@/assets/img/profile.png'
import capName from '@/functions/capName';
const props = defineProps({
    notificaiton: {
        type: Object,
        required: true
    }
})
</script>
<template>
    <div class="container">
        <div class="flex w-full">
            <div class="profile-pic-container pic-container">
                <img :src="profile" />
            </div>
            <div class="flex justify-center items-start flex-col">
                <div class="flex">
                    <div class="font-bold text-xl">{{ capName(notificaiton.sender.fname) }} {{ capName(notificaiton.sender.lname) }}</div>
                </div>
                <div class="text-lg"> 
                    <!-- {{ new Date(notificaiton.date).toLocaleString() }} -->
                    Started following you!
                </div>
            </div>
        </div>
        <div v-if="notificaiton.type === 'request'" class="flex justify-center items-center">
            <button class=" button text-lg">Follow</button>
        </div>
    </div>
</template>
<style scoped>
.container {
    z-index: 999999;
    width: 100%;
    background-color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1.5rem;
}
.pic-container{
    width: 50px;
    height: 50px;
    border-radius: 100%;
    overflow: hidden;
    margin-right: 1rem
}
</style>