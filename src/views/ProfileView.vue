<script setup>
import { ref } from 'vue';
import NavBar from '../components/NavBar.vue'
import ProfileDefault from '../components/ProfileDefault.vue'
import ProfileEdit from '../components/ProfileEdit.vue'

// Reactive state to track if the profile is being edited
const isEditing = ref(false);

// Function to toggle the editing state
const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};
</script>

<template>
    <section>
      <NavBar></NavBar>
      <article v-if="!isEditing">
        <ProfileDefault @edit="toggleEdit"></ProfileDefault>
      </article>
      <article v-else>
      <ProfileEdit @cancel="toggleEdit" @save="toggleEdit"></ProfileEdit>
    </article>
    </section>
  </template>

<style scoped>

</style>



