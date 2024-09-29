<script setup>
import logo from '@/assets/img/company-logo.png'
</script>
<template>
    <div class="container">
        <img :src="logo" class="logo  animate" />
    </div>
</template>
<style scoped>
.container {
    width: 100vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.555);
    position: fixed;
    z-index: 9999999;
    top: 0;
    overflow: hidden;
}

.animate {
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;

    @keyframes ping {

        75%,
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
}

.logo {
    width: 100%;
    height: 100%;
    opacity: .5
}
</style>