<script setup></script>

<template>
  <section>
    <img src="../assets/121Team.png" alt="CoverApp" />
    <div class="welcome">
      <h1>Task-it</h1>
      <p>Add, edit, delete, all the tasks you need</p>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
}

img {
  padding-top: 40px;
  width: 25%;
}

h1,
p {
  margin: 0;
  padding: 8px;
}

h1 {
  font-size: 40px;
  color: #072ac8;
}

p {
  color: #514d67;
}
</style>
