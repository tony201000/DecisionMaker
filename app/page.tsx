"use client"

import { CTASection } from "@/components/landing/cta-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HeroSection } from "@/components/landing/hero-section"
import { MethodSection } from "@/components/landing/method-section"
import { UnifiedHeader } from "@/components/shared/unified-header"
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
