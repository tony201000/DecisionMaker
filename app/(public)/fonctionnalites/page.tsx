import { UnifiedHeader } from "@/components/shared/unified-header"
import { CtaSection } from "../../../features/public/fonctionnalites/components/CtaSection"
import { FeaturesGrid } from "../../../features/public/fonctionnalites/components/FeaturesGrid"
import { HeroSection } from "../../../features/public/fonctionnalites/components/HeroSection"
import { StatsSection } from "../../../features/public/fonctionnalites/components/StatsSection"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* UnifiedHeader est probablement un composant partagé, potentiellement un Client Component s'il contient de l'interactivité */}
      <UnifiedHeader />

      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesGrid />
        <CtaSection />
      </main>
    </div>
  )
}
