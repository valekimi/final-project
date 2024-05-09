<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/task.js'
import { useUserStore } from '../stores/user.js'

const userStore = useUserStore();

const newTaskTitle = ref('')
const newTaskDescription = ref('')
const taskStore = useTaskStore()

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
  taskStore.fetchTasks();
}

taskStore.fetchTasks();

// Computed property to format timestamp to HH:MM
const formattedTimestamp = computed(() => {
  const tasks = taskStore.tasks || []; // Ensure tasks is an array

  return tasks.map(task => {
    const dateObj = new Date(task.inserted_at); // Parse the timestamp string into a Date object
    const formattedDate = dateObj.toLocaleDateString(); // Format the date
    const formattedTime = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}); // Format the time as HH:MM
    return `${formattedDate} ${formattedTime}`; // Combine date and time
  });
});

</script>

<template>
  <section>
    <div class="create-task">
      <div class="header">
        <h2>Add a new Task</h2>
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
            v-for="(task, index) in taskStore.tasks.filter((task) => !task.is_complete)"
            :key="task.id"
            class="task-card"
          >
            <div class="card-info">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <p class="timestamp">{{ formattedTimestamp[index] }}</p>
            </div>
            <div class="card-options">
              <div>
                <button @click="editTask(task)">✏️ Edit</button>
                <button @click="deleteTask(task)">🗑️ Delete</button>
              </div>
              <button @click="markComplete(task)">Mark Complete</button>
            </div>
          </div>
        </div>
      </div>

      <div class="completed">
        <h3>Completed</h3>
        <div v-if="taskStore.tasks" class="card-list">
          <div
            v-for="(task, index) in taskStore.tasks.filter((task) => task.is_complete)"
            :key="task.id"
            class="task-card"
          >
            <div class="card-info">
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <p class="timestamp">{{ formattedTimestamp[index] }}</p>
            </div>
            <div class="card-options">
              <div>
                <button @click="editTask(task)">✏️ Edit</button>
                <button @click="deleteTask(task)">🗑️ Delete</button>
              </div>
              <button @click="backToTodo(task)">Back To Do</button>
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
  color: #BCBCBC;
}

.card-options {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
}

.card-options button {
  border: 1px solid #d1edff;
  border-radius: 4px;
  background-color: #ffffff;
  color: #514d67;
  font-size: 12px;
  height: 30px;
}

.card-options div {
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: 100%;
}
</style>
