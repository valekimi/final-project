<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { storeToRefs } from 'pinia';

const router = useRouter()
const userStore = useUserStore()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showEmailError = ref(false)
const showSuccessPopup = ref(false)
const errorMessage = ref('')
const { user } = storeToRefs(userStore)

async function handleSignUp() {
  if (password.value === confirmPassword.value) {
    // Compare the values of the refs
    try {
      await userStore.signUp(email.value, password.value)
      if (user.value) {
        showSuccessPopup.value = true
      }
    } catch (error) {
      console.error('Error: ', error)
      errorMessage.value = error.message
    }
  } else {
    errorMessage.value = 'Passwords do not match.'
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Sign Up</h2>
    </div>
    <form @submit.prevent="handleSignUp">
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
      </div>
      <div class="password">
        <label for="confirmPassword">Confirm password</label>
        <input
          v-model="confirmPassword"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your password"
          required
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <div v-if="showEmailError" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="showSuccessPopup" class="success-message">You did it! Check your inbox.</div>
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

.success-message {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #d8f1e4;
  width: 100%;
  height: 30px;
  color: darkgreen;
  font-size: 14px;
  border-radius: 4px;
}
</style>