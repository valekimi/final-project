<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { useTaskStore } from '@/stores/task.js';

const router = useRouter()
const userStore = useUserStore()
const taskStore = useTaskStore();
const email = ref('')
const password = ref('')

async function signIn() {
  await userStore.signIn(email.value, password.value)
  if (userStore.user) {
    console.log(userStore.user.id);
    // Handle successful sign-in, maybe show a message or redirect
    await taskStore.fetchTasks(userStore.user.id);
    router.push('/')
  }
}

</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Sign In</h2>
    </div>
    <form @submit.prevent="signIn">
      <div class="email">
        <label for="email">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email address"
          required
        />
      </div>
      <div class="password">
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
        />
        <a href="">Forgot Password?</a>
      </div>
      <button type="submit">Sign In</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  color: #072ac8;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 342px;
}

.email,
.password {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  width: 100%;
}

input {
  border: none;
  border-radius: 4px;
  background-color: #f4f6fc;
  padding: 16px;
}

button {
  border: none;
  border-radius: 4px;
  background-color: #072ac8;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  width: 100%;
  height: 48px;
}

a {
    margin: 8px 0px;
}
</style>
