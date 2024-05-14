// /store/user.js
import { defineStore } from 'pinia'
import { supabase } from '../supabase.js'
import router from '@/router'

/*

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),

  */

  // cambiato quello sopra con questo 
export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    profile: null // Add profile state
  }),

  // questo era cosi
  actions: {
    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    },

// Da qui codice nuovo
    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });
      if (error) {
        alert("This account already exists");
        throw error;
      }
      if (data) {
        // Create a profile for the user
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert({ email });
        if (profileError) {
          console.error("Error creating profile:", profileError);
          throw profileError;
        }
        // Associate profile with user
        const profileId = profileData[0].id;
        await supabase
          .from('users')
          .update({ profile_id: profileId })
          .eq('id', data.user.id);
        this.user = data.user;
        this.profile = { id: profileId, email }; // Store profile info
      }
      return { data, error };
    },

    async fetchUserProfile(email) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      this.profile = data;
    },


    // FIno a QUI


    //QUESTO era il codice prima del precedente
    /*
    async signUp(email, password) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })
      if (error) {
        alert('This account already exist')
        throw error
      }
      if (data) {
        this.user = data.user
      }
      return { data, error } // Return the data and error for checking in the component
    },
    */

    //DA QUI NON ho PIU TOCCATO

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
        this.user = null
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
