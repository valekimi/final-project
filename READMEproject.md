#FINAL PROJECT - App - Task Manager + Account authentication

used: Vite / Falseado base dato con Supabase / Router /

Day 1: understand project structure, insert first HTML and CSS in Auth view, creating component sign up and sign in

Day 2: connecting components with view and add logic, implement the log out funcionality connected with sign in and sign up

Day 3: created task component and add login to add new task in the To Do list, also fetching existing tasks, adjusted the date/time format

Day 4: added option to delete, mark as complete, edit, save the edit - a task

Day 5: fixed issue with password and confirming password. Add alert if user already signed up with that email - tried to assigned own user tasks but failed

Day 6: fixed issue to assign task per user, also fixed issue delete card after refresh, responsive, added profile page

Day 7: Connected the profile 


Auth
===
Sign Up
===
Sign In
===
Dashboard
===
Create Task
===
Edit Task
===
Mark Complete
===
Delete task
===
Profile
===
Edit Profile
===
Log Out



====
NavBar.vue
----
<script setup>
import { useUserStore } from '../stores/user.js'
const userStore = useUserStore()
</script>

<template>
  <section>
    <header>
      <div><h3>Task-it</h3></div>
      <!--
      <ul>
        <li><a href="">Home</a></li>
        <li><a href="">Tasks</a></li>
        <li><a href="">Timer</a></li>
      </ul>
      -->
      <div class="log">
        <div class="profile">
          <div class="img"></div>
          <p>Profile</p>
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

h3 {
  margin: none;
}

/*
ul {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;
  list-style: none;
  margin: none;
}
*/

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
}

.img {
  width: 48px;
  height: 48px;
  background-image: url(/src/assets/beanhead\ 3.svg);
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
====


====
Task.js  14 May - Add task, edit, delete, merk complete, assigned task per user
----
// /store/task.js

import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import { useUserStore } from './user'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: null
  }),

  actions: {
    async fetchTasks(userId) {
      const { data: fetchedTasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId) // Filter tasks based on user_id
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching tasks:', error.message)
        return
      }
      this.tasks = fetchedTasks || []
    },

    async addTask(newTask) {
      // Associate the task with the current user's user_id
      newTask.user_id = useUserStore().user.id
      // Add the new task to the database
      const { data, error } = await supabase.from('tasks').insert(newTask)

      if (error) {
        console.error('Error adding new task:', error.message)
        return
      }
    },

    async deleteTask(task) {
      const { error } = await supabase.from('tasks').delete().eq('id', task.id)

      if (error) {
        console.error('Error deleting the task:', error.message)
      }
    },
    
    async updateTask(task) {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          description: task.description,
          is_complete: task.is_complete
        })
        .eq('id', task.id)

      if (error) {
        console.error('Error updating the task:', error.message)
      }
    }
  }
})
====



====
Task.vue  14 May - Add task, edit, delete, merk complete, assigned task per user
----
<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/task.js'
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore()
const taskStore = useTaskStore()
const newTaskTitle = ref('')
const newTaskDescription = ref('')


const handleSubmit = async () => {
  const newTask = {
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    user_id: userStore.user.id
  }
  await taskStore.addTask(newTask)
  // Clear input fields after adding task
  newTaskTitle.value = ''
  newTaskDescription.value = ''
  await taskStore.fetchTasks(userStore.user.id) // Use await to make sure fetchTasks is completed before proceeding
}

const filteredTasks = computed(() => {
  const tasks = taskStore.tasks || [] // Ensure tasks is defined
  const userId = userStore.user.id
  return tasks.filter((task) => task.user_id === userId)
})

// Computed property to format timestamp to HH:MM
const formattedTimestamp = computed(() => {
  const tasks = taskStore.tasks || [] // Ensure tasks is an array

  return tasks.map((task) => {
    const dateObj = new Date(task.inserted_at) // Parse the timestamp string into a Date object
    const formattedDate = dateObj.toLocaleDateString() // Format the date
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // Format the time as HH:MM
    return `${formattedDate} ${formattedTime}` // Combine date and time
  })
})

const deleteTask = async (task) => {
  const confirmed = confirm('Are you sure you want to delete this task?')
  if (confirmed) {
    await taskStore.deleteTask(task)
    await taskStore.fetchTasks(userStore.user.id) // Wait for fetchTasks to complete
  }
}

const markComplete = async (task) => {
  task.is_complete = true // Update the task's status
  await taskStore.updateTask(task) // Update the task in the store and the database
  taskStore.fetchTasks() // Refresh the task list after updating
}

const backToTodo = async (task) => {
  task.is_complete = false // Update the task's status
  await taskStore.updateTask(task) // Update the task in the store and the database
  taskStore.fetchTasks() // Refresh the task list after updating
}

const toggleEditMode = (task) => {
  task.editMode = !task.editMode
  // Set the updated title and description to the current title and description
  if (task.editMode) {
    task.updatedTitle = task.title
    task.updatedDescription = task.description
  }
}

const saveChanges = async (task) => {
  task.title = task.updatedTitle // Update the task title
  task.description = task.updatedDescription // Update the task description
  task.editMode = false // Exit edit mode
  await taskStore.updateTask(task) // Update the task in the store and the database
  taskStore.fetchTasks() // Refresh the task list after updating
}

const cancelEdit = (task) => {
  task.editMode = false // Exit edit mode without saving
}
</script>

<template>
  <section>
    <div class="create-task">
      <div class="header">
        <h2>Add a Task</h2>
        <div>
          <p>Keep your life organized!</p>
          <p>Create tasks which will help you to get things done.</p>
        </div>
      </div>
      <form @submit.prevent="handleSubmit">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="Give a title to your task"
          required
        />
        <textarea
          v-model="newTaskDescription"
          placeholder="Add task information"
          rows="4"
        ></textarea>
        <button type="submit">Add</button>
      </form>
    </div>

    <article class="existing-tasks">
      <div class="to-do">
        <h3>To do</h3>
        <div v-if="taskStore.tasks" class="card-list">
          <div
            v-for="(task, index) in filteredTasks.filter((task) => !task.is_complete)"
            :key="task.id"
            class="task-card"
          >
            <div v-if="!task.editMode" class="card-info">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <p class="timestamp">{{ formattedTimestamp[index] }}</p>
            </div>

            <div v-else class="edit-inputs">
              <input v-model="task.updatedTitle" />
              <textarea v-model="task.updatedDescription" rows="4"></textarea>
            </div>

            <div v-if="!task.editMode" class="card-options">
              <div>
                <button @click="toggleEditMode(task)">✏️ Edit</button>
                <button @click="deleteTask(task)">🗑️ Delete</button>
              </div>
              <button @click="markComplete(task)">Mark Complete</button>
            </div>

            <div v-else class="cancel-save">
              <button @click="cancelEdit(task)" class="cancel">Cancel</button>
              <button @click="saveChanges(task)" class="save">Save</button>
            </div>
          </div>
        </div>
      </div>

      <div class="completed">
        <h3>Completed</h3>
        <div v-if="taskStore.tasks" class="card-list">
          <div
            v-for="(task, index) in filteredTasks.filter((task) => task.is_complete)"
            :key="task.id"
            class="task-card-done"
          >
            <div v-if="!task.editMode" class="card-info">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <p class="timestamp">{{ formattedTimestamp[index] }}</p>
            </div>

            <div v-else class="edit-inputs">
              <input v-model="task.updatedTitle" />
              <textarea v-model="task.updatedDescription" rows="4"></textarea>
            </div>

            <div v-if="!task.editMode" class="card-options">
              <div>
                <button @click="toggleEditMode(task)">✏️ Edit</button>
                <button @click="deleteTask(task)">🗑️ Delete</button>
              </div>
              <button @click="backToTodo(task)">Back To Do</button>
            </div>

            <div v-else class="cancel-save">
              <button @click="cancelEdit(task)" class="cancel">Cancel</button>
              <button @click="saveChanges(task)" class="save">Save</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.create-task {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  gap: 40px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 342px;
}

h2 {
  color: #072ac8;
  margin: 0;
  text-align: center;
}

h3 {
  color: #072ac8;
  margin: 0;
}

.header p {
  text-align: center;
}

form input {
  width: 100%;
  box-sizing: border-box;
}

form textarea {
  width: 100%;
  box-sizing: border-box;
  font-family: 'Raleway';
}

.task-card {
  background-color: #f4f6fc;
  border: none;
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.task-card-done {
  background-color: #ecfff5;
  border: none;
  border-radius: 8px;
  padding: 16px;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

h4 {
  color: #514d67;
  margin: 0;
}

p {
  color: #514d67;
  font-size: 14px;
  margin: 0;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 342px;
}

input,
textarea {
  border: none;
  border-radius: 4px;
  background-color: #f4f6fc;
  padding: 8px 16px;
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

.existing-tasks {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 40px;
  padding: 40px;
}

.to-do,
.completed {
  width: 342px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timestamp {
  font-size: 12px;
  color: #bcbcbc;
}

.card-options {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
}

.card-options button,
.cancel {
  border: 1px solid #d1edff;
  border-radius: 4px;
  background-color: #ffffff;
  color: #514d67;
  font-size: 12px;
  height: 30px;
}

.save {
  font-size: 12px;
  height: 30px;
  border: 1px solid #ffffff;
}

.edit-inputs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-inputs input,
.edit-inputs textarea {
  background-color: #ffffff;
  border: 1px solid #d1edff;
  font-family: 'Raleway';
  color: #514d67;
}

.card-options div,
.cancel-save {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
}
</style>
====



SignUp.vue  14 May - Add task, edit, delete, merk complete, assigned task per user
====
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const router = useRouter()
const userStore = useUserStore()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showEmailError = ref(false)
const showSuccessPopup = ref(false)

async function handleSignUp() {
  if (password.value === confirmPassword.value) { // Compare the values of the refs
    try {
      const { data, error } = await userStore.signUp(email, password)
      if (error) {
        showEmailError.value = true
      } else if (data) {
        showSuccessPopup.value = true
      }
    } catch (error) {
      console.error('Error: ', error)
    }
  } else {
    console.error('Please try again, the password does not match')
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
</style>
====


SignIn.vue  14 May - Add task, edit, delete, merk complete, assigned task per user
====
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { useTaskStore } from '@/stores/task.js';

const router = useRouter()
const userStore = useUserStore()
const taskStore = useTaskStore();
const email = ref('')
const password = ref('')

async function signIn() {
  await userStore.signIn(email.value, password.value)
  if (userStore.user) {
    console.log(userStore.user.id);
    // Handle successful sign-in, maybe show a message or redirect
    await taskStore.fetchTasks(userStore.user.id);
    router.push('/')
  }
}

</script>

<template>
  <div class="container">
    <div class="header">
      <h2>Sign In</h2>
    </div>
    <form @submit.prevent="signIn">
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
        <a href="">Forgot Password?</a>
      </div>
      <button type="submit">Sign In</button>
    </form>
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

a {
    margin: 8px 0px;
}
</style>
====


User.js  17 May - Add, edit, delete, complete, assigned task per user, profile
====
// /store/user.js
import { defineStore } from 'pinia'
import { supabase } from '../supabase.js'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null,
  }),

  actions: {
    async fetchUser() {
      const { data, error } = await supabase.auth.getUser()
      if (error) console.error('Fetch user error:', error)
      this.user = data.user
      if (this.user) {
        await this.fetchUserProfile(this.user.id)
      }
    },

    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })
      if (error) {
        throw error
      }
      this.user = data.user
      console.log('User signed up:', this.user)
      await this.createUserProfile(data.user.id, email)
      return { data, error } // Return the data and error for checking in the component
    },

    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
      if (error) throw error
      this.user = data.user
      await this.fetchUserProfile(data.user.id)
    },

    async logOut() {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Log out error:', error.message)
      } else {
        // Redirect user or other post-logout cleanup
        console.log('Logout Sucessful')
        this.user = null
        this.profile = null
        router.push('/auth')
      }
    },

    async createUserProfile(userId, email) {
      const { data, error } = await supabase
        .from('profiles')
        .insert({ user_id: userId, email: email })
      if (error) {
        console.error('Error creating user profile:', error)
      }
      this.profile = data
    },

    async fetchUserProfile(userId) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      if (error) {
        console.error('Error fetching user profile:', error)
      }
      this.profile = data
    },

    async updateUserProfile(profileUpdates) {
      console.log(this.user.id);
      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('user_id', this.user.id)
      if (error) {
        console.error('Error updating profile:', error)
      }
      this.profile = data
    },

    persist: {
      enabled: true,
      strategies: [
        {
          key: 'user',
          storage: localStorage
        }
      ]
    }
  },

  // Initialize the store
  init() {
    this.persist.enabled = true
  }
})
====

ProfileDefault.vue: 17 May
====
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
        <div class="img" v-if="userProfile.avatar_url">
          <img :src="userProfile.avatar_url" alt="User Profile" />
        </div>
          <div class="no-img" v-else></div>
      </div>
      <div class="userdata">
        <div class="username">
          <p class="title">Username</p>
          <p class="data" v-if="userProfile.username">{{ userProfile.username }}</p>
          <p class="no-data" v-else><i>-</i></p>
        </div>
        <div class="name">
          <p class="title">Name</p>
          <p class="data" v-if="userProfile.name">{{ userProfile.name }}</p>
          <p class="no-data" v-else><i>-</i></p>
        </div>
        <div class="email">
          <p class="title">Email</p>
          <p class="data">{{ userProfile.email }}</p>
        </div>
        <div class="website">
          <p class="title">Website</p>
          <p class="data" v-if="userProfile.website">
            <a :href="userProfile.website">{{ userProfile.website }}</a>
          </p>
          <p class="no-data" v-else><i>-</i></p>
        </div>
      </div>
      <button @click="emit('edit')">Edit Profile</button>
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

.no-data {
  font-size: 14px;
  color: #a1a5b9;
}

.img {
  width: 120px;
  height: 120px;
  border-radius: 100px;
  border: solid 8px #ffffff;
}

.no-img {
  background-image: url(/src/assets/110Team.png);
  background-size: cover;
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
====


ProfileEdit.vue: 17 May
====
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

//Codice nuovo:

const handleFileChange = (event) => {
  const file = event.target.files //[0] questo era giusto dopo files
  // Assuming you have a method in your user store to handle avatar upload
  userStore
    .uploadAvatar(file)
    .then((url) => {
      avatarUrl.value = url
    })
    .catch((error) => {
      console.error('Error uploading avatar:', error)
    })
}
</script>

<template>
  <section class="profile-edit">
    <div class="profile">
      <h3>Update Profile</h3>
      <form @submit.prevent="handleProfileUpdate" class="userdata">
        <div class="data">
          <label for="avatarUrl">Avatar</label>
          <div class="picture">
            <div class="image"></div>
            <input id="avatar" type="file" accept="image/*" @change="handleFileChange" />
            <label class="choose" for="avatar">Choose File</label>
          </div>
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

.picture {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}

.avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.image {
  width: 120px;
  height: 120px;
}

.choose {
  display: flex;
  align-items: center;
  border: 1px solid #d1edff;
  border-radius: 4px;
  background-color: #ffffff;
  color: #514d67;
  font-size: 12px;
  height: 30px;
  padding: 0 12px;
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

#avatar {
  display: none;
  background-color: transparent;
  padding: 0;
  padding-top: 8px;
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
====



App.vue  14 May - Add task, edit, delete, merk complete, assigned task per user
====
<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user.js'
import { useTaskStore } from './stores/task.js'

const router = useRouter()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const taskStore = useTaskStore()
// const { task } = storeToRefs(taskStore)

onMounted(async () => {
  try {
    await userStore.fetchUser() // here we call fetch user
    // console.log(user.value);
    if (!user.value) {
      // redirect them to logout if the user is not there
      router.push({ path: '/auth' })
    } else {
      // continue to dashboard
      await taskStore.fetchTasks(user.value.id)
      router.push({ path: '/' })
    }
  } catch (e) {
    console.log(e)
  }
})
</script>

<template>
  <section>
    <router-view />
    <!-- your routes will load inside of these tags -->
  </section>
</template>

====