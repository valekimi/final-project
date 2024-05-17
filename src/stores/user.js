// /store/user.js
import { defineStore } from 'pinia'
import { supabase } from '../supabase.js'
import router from '@/router'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null
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
      console.log(this.user.id)
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
