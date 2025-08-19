import type { User } from "@supabase/supabase-js"
import { create } from "zustand"
import { devtools } from "zustand/middleware"
import { createClient } from "@/lib/supabase/client"

interface AuthState {
  // État principal
  user: User | null
  loading: boolean
  error: Error | null

  // État d'initialisation
  initialized: boolean
}

interface AuthActions {
  // Actions principales
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: Error | null) => void
  setInitialized: (initialized: boolean) => void

  // Actions métier
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

export type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  devtools(
    set => ({
      clearError: () => set({ error: null }, false, "clearError"),
      error: null,
      initialized: false,
      loading: true,

      refreshUser: async () => {
        try {
          set({ error: null, loading: true }, false, "refreshUser_start")
          const supabase = createClient()
          const {
            data: { session },
            error
          } = await supabase.auth.getSession()

          if (error) {
            set(
              {
                error,
                initialized: true,
                loading: false,
                user: null
              },
              false,
              "refreshUser_error"
            )
            return
          }

          set(
            {
              error: null,
              initialized: true,
              loading: false,
              user: session?.user || null
            },
            false,
            "refreshUser_success"
          )
        } catch (error) {
          set(
            {
              error: error as Error,
              initialized: true,
              loading: false
            },
            false,
            "refreshUser_catch"
          )
        }
      },

      setError: error => set({ error }, false, "setError"),

      setInitialized: initialized => set({ initialized }, false, "setInitialized"),

      setLoading: loading => set({ loading }, false, "setLoading"),

      // Actions
      setUser: user => set({ user }, false, "setUser"),

      signOut: async () => {
        try {
          const supabase = createClient()
          await supabase.auth.signOut()
          set({ error: null, user: null }, false, "signOut")
        } catch (error) {
          set({ error: error as Error }, false, "signOut_error")
        }
      },
      // Initial state
      user: null
    }),
    {
      name: "AuthStore"
    }
  )
)

// Selectors pour optimiser les re-renders
export const useAuthUser = () => useAuthStore(state => state.user)
export const useAuthLoading = () => useAuthStore(state => state.loading)
export const useAuthError = () => useAuthStore(state => state.error)
export const useAuthInitialized = () => useAuthStore(state => state.initialized)
