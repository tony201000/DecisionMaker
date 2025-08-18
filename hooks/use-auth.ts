"use client"

import type { AuthChangeEvent, Session } from "@supabase/supabase-js"
import { useEffect } from "react"
import { useAuthStore } from "@/lib/stores"
import { createClient } from "@/lib/supabase/client"

export function useAuth() {
  const { user, loading, error, initialized, setUser, setLoading, setError, setInitialized, refreshUser } = useAuthStore()

  useEffect(() => {
    // Initialisation uniquement si pas encore fait
    if (!initialized) {
      refreshUser()
    }
  }, [initialized, refreshUser])

  useEffect(() => {
    const supabase = createClient()

    // Écouter les changements d'authentification
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      setLoading(true)
      setError(null)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user || null)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }

      setLoading(false)
      setInitialized(true)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setLoading, setError, setInitialized])

  return {
    error,
    initialized,
    loading,
    user
  }
}
