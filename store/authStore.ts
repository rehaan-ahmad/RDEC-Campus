import { create } from 'zustand'
import { User } from 'firebase/auth'

interface AuthState {
  firebaseUser: User | null
  dbUser: any | null
  loading: boolean
  setFirebaseUser: (user: User | null) => void
  setDbUser: (user: any | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  dbUser: null,
  loading: true,
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  setDbUser: (user) => set({ dbUser: user }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ firebaseUser: null, dbUser: null })
}))
