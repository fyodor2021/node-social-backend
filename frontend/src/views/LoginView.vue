<script setup>
import logo from '@/assets/img/logo.png'
import router from '@/router';
import axios from 'axios'
import { computed, reactive, ref } from 'vue';
import {useValMessageStore} from '../store/valMessage.js'
import { useAuthStore } from '@/store/auth.js';
import { useNotiStore } from '@/store/notifications.js';
const valMessageStore = useValMessageStore()
const notiStore = useNotiStore()
const forgotPassword = ref(false)
const authStore = useAuthStore();
const form = reactive({
  email: '',
  password: '',
})
const handleSubmit = async () => {
  const userCred = {
    email: form.email, 
    password : form.password
  }
  axios.post('/auth/login',userCred).then(async res => {
    if(res && res.status === 200 && res.data ) {
      authStore.setToken(res.data.token)
      authStore.setFname(res.data.user.fname)
      authStore.setLname(res.data.user.lname)
      authStore.setEmail(res.data.user.email)
      authStore.setProfilePic(res.data.user.signedProfilePic)
      authStore.setId(res.data.user._id)
      await notiStore.getNotifications()
      router.push('/').then(
        () => router.go()
      )
    }else if (res && res.status === 204){
      console.log('im here')
      router.push('/')
    }
  }).catch(err => {
    if (err.response && err.response.data){
            valMessageStore.setValMessage(err.response.data)
        }
  })
}
const handleToggleForgot = () => {
  forgotPassword.value = !forgotPassword.value;
}

</script>
<template>
  <div class="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto  w-28 h-15 rounded-3xl" :src="logo" alt="Your Company">

      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{{ forgotPassword ? 'Reset your password': 'Login to your Account' }}
      </h2>

    </div>
    <div v-if="!forgotPassword" class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div class="mt-2">
            <input v-model="form.email" id="email" name="email" type="email" autocomplete="email" required
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-2">
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div class="text-sm">
              <button  type="button" @click="handleToggleForgot" class="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</button>
            </div>
          </div>
          <div class="mt-2">
            <input v-model="form.password" id="password" name="password" type="password" autocomplete="current-password" required
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 p-2">
          </div>
        </div>
        <div class="h-2"><span class="text-red-500">{{ valMessageStore.valMessage ? valMessageStore.valMessage : '' }}</span></div>
        <div>
          <button type="submit"
            class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Log
            in</button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        <RouterLink to="/register" class="font-semibold leading-6 text-blue-600 hover:text-blue-500">Register
        </RouterLink>
      </p>
    </div>
    <div v-else="forgotPassword" class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
            <label for="new-password" class="block text-sm font-medium leading-6 text-gray-900">New Password</label>
          <div class="mt-2">
            <input v-model="form.password" id="new-password" name="new-password" type="password" autocomplete="current-password" required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
          </div>
        </div>
        <div>
            <label for="new-password-retype" class="block text-sm font-medium leading-6 text-gray-900">Retype Password</label>
          <div class="mt-2">
            <input v-model="form.password" id="new-password-retype" name="new-password-retype" type="password" autocomplete="current-password" required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
          </div>
        </div>
        <div>
          <button type="submit"
          class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Reset</button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm text-gray-500">
        Back to
        <button @click="handleToggleForgot" class="font-semibold leading-6 text-blue-600 hover:text-blue-500">Login
        </button>
      </p>
    </div>
  </div>
</template>