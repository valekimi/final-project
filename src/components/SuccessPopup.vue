<script setup>
import { ref } from 'vue'

const show = ref(false)

function closePopup() {
  show.value = false
}

</script>

<template>
    <div v-if="show" class="success-popup">
      <div class="message">
        <p><b>Sign-up successful!</b></p>
        <p>You will receive an email to confirm your sign-up.</p>
      </div>
      <button @click="closePopup">Close</button>
    </div>
  </template>
  

  
  <style scoped>
  .success-popup {
    margin: 24px;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #f4f6fc;
  }

  .message {
    color: #514d67;
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

  </style>