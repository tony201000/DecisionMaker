"use client"

import { UnifiedHeader } from "@/components/shared/unified-header"
import { CTASection } from "@/features/landing/components/cta-section"
import { FeaturesSection } from "@/features/landing/components/features-section"
import { HeroSection } from "@/features/landing/components/hero-section"
import { MethodSection } from "@/features/landing/components/method-section"
import { useAuth } from "@/hooks/use-auth"

export default function LandingPage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader
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
