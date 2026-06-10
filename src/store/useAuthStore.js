import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { registerUser, loginUser, getMe, updateProfile } from '../api/backend'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      dna: null,
      token: null,
      loading: false,
      error: null,

      register: async (data) => {
        set({ loading: true, error: null })
        try {
          const res = await registerUser(data)
          const { token, user, dna } = res.data
          set({ token, user, dna, loading: false })
          return true
        } catch (err) {
          const msg = err.response?.data?.detail || 'Registration failed'
          set({ error: msg, loading: false })
          return false
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const res = await loginUser({ email, password })
          const { token, user, dna } = res.data
          set({ token, user, dna, loading: false })
          return true
        } catch (err) {
          const msg = err.response?.data?.detail || 'Login failed'
          set({ error: msg, loading: false })
          return false
        }
      },

      fetchMe: async () => {
        const { token } = get()
        if (!token) return
        try {
          const res = await getMe(token)
          const { user, dna } = res.data
          set({ user, dna })
        } catch {
          set({ user: null, dna: null, token: null })
        }
      },

      updateProfile: async (data) => {
        const { token } = get()
        if (!token) return false
        set({ loading: true })
        try {
          const res = await updateProfile(data, token)
          const { user, dna } = res.data
          set({ user, dna, loading: false })
          return true
        } catch (err) {
          set({ error: err.response?.data?.detail || 'Update failed', loading: false })
          return false
        }
      },

      logout: () => set({ user: null, dna: null, token: null, error: null }),

      clearError: () => set({ error: null }),
    }),
    { name: 'cinemood-auth', partialize: (state) => ({ token: state.token, user: state.user, dna: state.dna }) }
  )
)
