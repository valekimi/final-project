<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const router = useRouter()
const userStore = useUserStore()

</script>

<template>
  <section>
    <header>
      <div class="task"><img src="/src/assets/121Team.png" alt=""><h3><router-link to="/">Task-it</router-link></h3></div>
      <div class="log">
        <div class="profile" >
          <div class="img"></div>
          <router-link to="/profile"><p>Profile</p></router-link>
        </div>
        <button @click="userStore.logOut">Log Out</button>
      </div>
    </header>
  </section>
</template>

<style scoped>
section {
  margin: 0;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 24px;
  background-color: #072ac8;
  color: #ffffff;
}

.task {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.task img {
  width: 40px;
  height: 40px;
}

h3 {
  margin: none;
  font-size: 600;
}

h3 :hover {
  color:lightcyan;
}

a {
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  color: #ffffff;
}

.profile {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.img {
  width: 24px;
  height: 24px;
  background-image: url(/src/assets/UserCircle.svg);
  background-size: cover;
}

.profile p {
  font-size: 14px;
}

.log {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

button {
  border: none;
  border-radius: 4px;
  background-color: #536cea;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  padding: 0px 16px;
  height: 30px;
}

</style>
