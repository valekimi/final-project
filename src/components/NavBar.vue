<script setup>
import { useUserStore } from '../stores/user.js'
const userStore = useUserStore()
</script>

<template>
  <section>
    <header>
      <div><h3>Task-it</h3></div>
      <ul>
        <li><a href="">Home</a></li>
        <li><a href="">Tasks</a></li>
        <li><a href="">Timer</a></li>
      </ul>
      <div class="logout">
        <p><i>You are logged!</i></p>
        <button @click="userStore.logOut">Log Out</button>
      </div>
    </header>
  </section>
</template>

<style scoped>
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0px 100px;
  background-color: #072ac8;
  color: #ffffff;
}

h3 {
  margin: none;
}

ul {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;
  list-style: none;
  margin: none;
}

a {
  font-size: 18px;
  font-weight: 500;
  text-decoration: none;
  color: #ffffff;
}

.logout {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

button {
  border: none;
  border-radius: 4px;
  background-color: #ffffff;
  color: #072ac8;
  font-weight: 600;
  font-size: 14px;
  padding: 0px 16px;
  height: 30px;
}
</style>
