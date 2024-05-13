// /store/task.js

import { defineStore } from 'pinia'
import { supabase } from '../supabase'

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
      newTask.user_id = userStore.user.id
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
