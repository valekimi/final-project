// /store/task.js

import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: null
  }),
  actions: {
    async fetchTasks() {
      const { data: fetchedTasks, error } = await supabase
        .from('tasks')
        .select('*')
        .order('id', { ascending: false })

      if (error) {
        console.error('Error fetching tasks:', error.message)
        return
      }
      this.tasks = fetchedTasks || []
    },
    async addTask(newTask) {
      // Add the new task to the database
      const { data, error } = await supabase.from('tasks').insert(newTask)

      if (error) {
        console.error('Error adding new task:', error.message)
        return
      }
    }
  }
})
