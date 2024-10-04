<script setup>
import logo from '@/assets/img/logo.png'
import { onMounted, reactive } from 'vue';
import axios from 'axios';
import { useValMessageStore } from '../store/valMessage'
import router from '@/router';
const valMessageStore = useValMessageStore()
const form = reactive({
    fname: '',
    lname: '',
    email: '',
    password: '',
    passwordRetype: '',
})
const handleSubmit = async () => {
    const userCred = {
        fname: form.fname,
        lname: form.lname,
        email: form.email,
        password: form.password,
        passwordRetype: form.passwordRetype
    }
    axios.post('/user/signup', userCred)
    .then(res => {
        console.log(res)
        if(res && res.status === 201 ){
            valMessageStore.setValMessage('User created Successfully')
            router.push('/login')
        }
    }).catch(err => {
        console.log(err)
        if (err.response && err.response.data){
            valMessageStore.setValMessage(err.response.data)
        }
    })
}
onMounted(() => {
    valMessageStore.setValMessage('')
})
</script>
<template>
    <div class="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto  w-28 h-15 rounded-3xl" :src="logo" alt="Your Company">
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your
                account
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" @submit.prevent="handleSubmit">
                <div class="flex justify-between">
                    <div class="flex flex-col">
                        <label for="fname" class="block text-sm font-medium leading-6 text-gray-900">First Name
                        </label>
                        <div class="mt-2">
                            <input v-model="form.fname" id="fname" name="fname" type="text" required
                                class="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label for="lname" class="block text-sm font-medium leading-6 text-gray-900">Last
                            Name</label>
                        <div class="mt-2">
                            <input v-model="form.lname" id="lname" name="lname" type="lname" required
                                class="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                        </div>
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                    <div class="mt-2">
                        <input v-model="form.email" id="email" name="email" type="email" autocomplete="email" required
                            class="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                    </div>
                </div>
                <div>
                    <div class="flex items-center justify-between">
                        <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    </div>
                    <div class="mt-2">
                        <input v-model="form.password" id="password" name="password" type="password"
                            autocomplete="current-password" required
                            class="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label for="password-retype" class="block text-sm font-medium leading-6 text-gray-900">Retype
                            Password</label>
                    </div>
                    <div class="mt-2">
                        <input v-model="form.passwordRetype" id="password-retype" name="password-retype" type="password"
                            required
                            class="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6">
                    </div>
                </div>
                <div class="h-2">
                    <span class="text-red-500 ">{{ valMessageStore.valMessage }}</span>
                </div>

                <div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Sign
                        in</button>
                </div>
            </form>

            <p class="mt-10 text-center text-sm text-gray-500">
                Already member?
                <RouterLink to="/login" class="font-semibold leading-6 text-blue-600 hover:text-blue-500">Login
                </RouterLink>
            </p>
        </div>
    </div>
</template>