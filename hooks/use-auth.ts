"use client"

import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const supabase = createClient()
        const {
          data: { session }
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const supabase = createClient()
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { error, loading, user }
}
