<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()
const userProfile = ref(null)

onMounted(async () => {
  if (userStore.user) {
    await userStore.fetchUserProfile(userStore.user.id)
    userProfile.value = userStore.profile
  }
})

const emit = defineEmits(['edit'])

</script>

<template>
  <section class="profile-default">
    <div v-if="userProfile" class="profile">
        <h3>Profile</h3>
      <div class="pic">
        <div class="img">
          <img :src="userProfile.avatarUrl" alt="User Profile" />
        </div>

      </div>
      <div class="userdata">
        <div class="username">
            <p class="title">Username</p>
            <p class="data"> {{ userProfile.username }}</p>
        </div>
        <div class="name">
            <p class="title">Name</p>
            <p class="data">{{ userProfile.name }}</p>
        </div>
        <div class="email">
            <p class="title">Email</p>
            <p class="data">{{ userProfile.email }}</p>
        </div>
        <div class="website">
            <p class="title">Website</p>
            <p class="data"><a href="{{ userProfile.website }}">{{ userProfile.website }}</a></p>
        </div>

      </div>
      <button @click="$emit('edit')">Edit Profile</button>
    </div>
    <div v-else class="nothing">
      <p>Nothing to show in your Profile page...</p>
      <div>
        <img src="/src/assets/125Team.png" alt="Why!?" />
      </div>
    </div>
  </section>
</template>

<style scoped>

.profile-default {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}

.profile {
  width: 342px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  background-color: #f4f6fc;
  border-radius: 8px;
  padding: 32px;
}

h3 {
  color: #072ac8;
  margin: 0;
}

p {
    margin: 0;
    color: #072ac8;
}

.img {
  width: 120px;
  height: 120px;
}

.userdata {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
}

.userdata div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.title {
    font-weight: 600;
    font-size: 12px;
    color: #8d92ab;
}

a {
    text-decoration: none;
    color: #072ac8;
}

button {
  border: 1px solid #d1edff;
  border-radius: 4px;
  background-color: #ffffff;
  color: #514d67;
  font-size: 12px;
  height: 30px;
  padding: 0 16px;
}

.nothing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50vh;
}

.nothing img {
  width: 240px;
}
</style>
