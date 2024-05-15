#FINAL PROJECT - App - Task Manager + Account authentication

used: Vite / Falseado base dato con Supabase / Router /

Day 1: understand project structure, insert first HTML and CSS in Auth view, creating component sign up and sign in

Day 2: connecting components with view and add logic, implement the log out funcionality connected with sign in and sign up

Day 3: created task component and add login to add new task in the To Do list, also fetching existing tasks, adjusted the date/time format

Day 4: added option to delete, mark as complete, edit, save the edit - a task

Day 5: fixed issue with password and confirming password. Add alert if user already signed up with that email - tried to assigned own user tasks but failed

Day 6: fixed issue to assign task per user, also fixed issue delete card after refresh, responsive, added profile page

Day 7: 


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


User.js  14 May - Add task, edit, delete, merk complete, assigned task per user
====
// /store/user.js
import { defineStore } from 'pinia'
import { supabase } from '../supabase.js'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),

  actions: {
    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    },

    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })
      if (error) {
        alert("This account already exist")
        throw error
      }
      if (data) {
        this.user = data.user
      }
      return { data, error } // Return the data and error for checking in the component
    },

    async signIn(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
      if (error) throw error
      this.user = data.user
    },

    async logOut() {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Log out error:', error.message)
      } else {
        // Qui puoi reindirizzare l'utente o fare altre pulizie post-logout
        console.log('Logout Sucessful')
        this.user = null;
        router.push('/auth')
      }
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