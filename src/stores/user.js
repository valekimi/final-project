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
      if (error) throw error
      if (data) this.user = data.user
    },
    async signIn(email, password) {
      const { user, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
      if (error) throw error
      if (user) this.user = user
      router.push('/')
    },
    async logOut() {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Log out error:', error.message)
      } else {
        // Qui puoi reindirizzare l'utente o fare altre pulizie post-logout
        console.log('Logout Sucessful')
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
  }
})
