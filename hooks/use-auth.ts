"use client"

import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    getUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return { user }
}
