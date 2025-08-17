import { UnifiedHeader } from "@/components/shared/unified-header"
import { CompaniesSection } from "../../../features/public/temoignages/components/CompaniesSection"
import { CtaSection } from "../../../features/public/temoignages/components/CtaSection"
import { HeroSection } from "../../../features/public/temoignages/components/HeroSection"
import { ShareExperienceSection } from "../../../features/public/temoignages/components/ShareExperienceSection"
import { StatsSection } from "../../../features/public/temoignages/components/StatsSection"
import { TestimonialsGrid } from "../../../features/public/temoignages/components/TestimonialsGrid"

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />

      <main>
        <HeroSection />
        <StatsSection />
        <TestimonialsGrid />
        <CompaniesSection />
        <ShareExperienceSection />
        <CtaSection />
      </main>
    </div>
  )
}
