import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  sedeActiva: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  setSedeActiva: (sedeId: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  sedeActiva: null,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ user: session?.user ?? null, loading: false })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  },

  setSedeActiva: (sedeId: string) => {
    set({ sedeActiva: sedeId })
    localStorage.setItem('sedeActiva', sedeId)
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    set({ user: null, sedeActiva: null })
    localStorage.removeItem('sedeActiva')
  },
}))

const savedSede = localStorage.getItem('sedeActiva')
if (savedSede) {
  useAuthStore.getState().sedeActiva = savedSede
}
