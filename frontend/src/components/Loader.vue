<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
const display = ref(true)
const activate = ref(false)
defineProps({
    activate: {
        type: Boolean,
        default: false
    }
})
</script>
<template>
    <div :class="'wrapper'">
        <i class="pi pi-spinner animate-spin text-4xl"></i>
    </div>
</template>
<style scoped>
.wrapper {
    padding: .5rem;
    margin: 0 auto;
    width: 55px;
    margin-top: 10rem;
    outline: 1px solid rgba(0, 0, 0, 0.295);
    background-color: rgba(255, 255, 255, 0.411);
    border-radius: 99999rem;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 3px 1px #00000030;
}
</style>