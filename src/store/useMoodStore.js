import { create } from 'zustand'

export const useMoodStore = create((set) => ({
  mood: null,
  movies: [],
  loading: false,
  error: null,
  chatHistory: [],

  setMood: (mood) => set({ mood }),
  setMovies: (movies) => set({ movies }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addChatMessage: (msg) =>
    set((s) => ({ chatHistory: [...s.chatHistory, msg] })),

  reset: () =>
    set({ mood: null, movies: [], chatHistory: [], error: null }),
}))
