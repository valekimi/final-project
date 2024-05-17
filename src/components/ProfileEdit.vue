<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()
const avatarUrl = ref(userStore.profile?.avatar_url || '')
const name = ref(userStore.profile?.name || '')
const username = ref(userStore.profile?.username || '')
const website = ref(userStore.profile?.website || '')

const emit = defineEmits(['cancel', 'save'])

const handleProfileUpdate = async () => {
  try {
    const updates = {
      avatar_url: avatarUrl.value,
      name: name.value,
      username: username.value,
      website: website.value
    }
    await userStore.updateUserProfile(updates)
    emit('save')
  } catch (error) {
    console.error('Error updating profile:', error)
  }
}

const cancelEdit = () => {
  emit('cancel')
}
</script>

<template>
  <section class="profile-edit">
    <div class="profile">
      <h3>Update Profile</h3>
      <form @submit.prevent="handleProfileUpdate" class="userdata">
          <div class="img">
            <img :src="avatarUrl || '/src/assets/110Team.png'" alt="User Avatar" class="avatar" />
          </div>
          <div class="data">
            <label for="avatarUrl">Avatar</label>
            <input v-model="avatarUrl" type="text" id="avatarUrl" placeholder="Add the image url" />
          </div>
        <div class="data">
          <label for="username">Username</label>
          <input v-model="username" type="text" id="username" />
        </div>
        <div class="data">
          <label for="name">Name</label>
          <input v-model="name" type="text" id="name" />
        </div>
        <div class="data">
          <label for="website">Website</label>
          <input v-model="website" type="text" id="website" />
        </div>
        <div class="actions">
          <button type="button" @click="cancelEdit" class="cancel">Cancel</button>
          <button type="submit" class="save">Save</button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.profile-edit {
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

label {
  font-weight: 600;
  font-size: 12px;
  color: #8d92ab;
}

.img {
  width: 100%;
  height: 136px;
  display: flex;
  justify-content: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 100px;
  border: solid 8px #ffffff;
}

.userdata {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}

.data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

input {
  background-color: #ffffff;
  border: none;
  border-radius: 4px;
  width: 100%;
  height: 40px;
  padding: 0 16px;
}

.actions {
  display: flex;
  gap: 12px;
}

.cancel {
  border: solid 1px #072ac8;
  border-radius: 4px;
  background-color: #ffffff;
  color: #072ac8;
  font-weight: 500;
  font-size: 14px;
  width: 100%;
  height: 30px;
}

.update {
  border: 1px solid #d1edff;
  border-radius: 4px;
  background-color: #ffffff;
  color: #514d67;
  font-size: 12px;
  height: 30px;
  padding: 0 16px;
}

.save {
  border: none;
  border-radius: 4px;
  background-color: #072ac8;
  color: #ffffff;
  font-weight: 500;
  font-size: 14px;
  width: 100%;
  height: 30px;
}
</style>
