<script setup>
import NavBar from '../components/NavBar.vue';

import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user.js';

const userStore = useUserStore();
const userProfile = ref(null);

onMounted(async () => {
  if (userStore.user) {
    await userStore.fetchUserProfile(userStore.user.email);
    userProfile.value = userStore.profile;
  }
});
</script>

<template>
  <section>
    <NavBar></NavBar>
    <div v-if="userProfile">
      <p>User Email: {{ userProfile.email }}</p>
      <!-- Display other profile information as needed -->
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </section>
</template>

<style scoped>
</style>
