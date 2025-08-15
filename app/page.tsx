"use client"

import type { Session, User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { CTASection } from "@/components/landing/cta-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { MethodSection } from "@/components/landing/method-section"
import { createClient } from "@/lib/supabase/client"

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    interface SupabaseSessionData {
      session: Session | null
    }

    interface SupabaseGetSessionResponse {
      data: SupabaseSessionData
    }

    supabase.auth.getSession().then(({ data: { session } }: SupabaseGetSessionResponse) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        loading={loading}
      />
      <HeroSection
        user={user}
        loading={loading}
      />
      <FeaturesSection />
      <MethodSection />

      {/* Testimonials Section */}
      <section
        id="temoignages"
        className="py-20"
      >
        {/* Testimonials content here */}
      </section>

      <CTASection
        user={user}
        loading={loading}
      />
    </div>
  )
}
