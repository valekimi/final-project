<script setup>
import Welcome from '../components/Welcome.vue'
import signUp from '../components/SignUp.vue'
import signIn from '../components/SignIn.vue'

import { ref } from 'vue'

const hasUser = ref(true)
function toggleUser() {
  hasUser.value = !hasUser.value
}
</script>

<template>
  <section>
    <Welcome />
    <article v-if="hasUser">
      <signIn></signIn>
      <div class="other-sign">
        <p>New in here?</p>
        <button @click="toggleUser">Sign Up</button>
      </div>
    </article>
    <article v-else>
      <signUp></signUp>
      <div class="other-sign">
        <p>Do you have an existing account?</p>
        <button @click="toggleUser">Sign In</button>
      </div>
    </article>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.other-sign {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #514d67;
  gap: 8px;
  padding: 40px 0px;
}

button {
  border: none;
  background-color: transparent;
  color: #072ac8;
  font-size: 16px;
  font-weight: bold;
  padding: 0;
}
</style>
