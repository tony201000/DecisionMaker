import { UnifiedHeader } from "@/components/shared/unified-header"
import { CtaSection } from "../../../features/public/methode/components/CtaSection"
import { HeroSection } from "../../../features/public/methode/components/HeroSection"
import { InteractiveDemoSection } from "../../../features/public/methode/components/InteractiveDemoSection"
import { PrinciplesSection } from "../../../features/public/methode/components/PrinciplesSection"
import { StepsSection } from "../../../features/public/methode/components/StepsSection"

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-background">
      <UnifiedHeader />

      <main>
        <HeroSection />
        <StepsSection />
        <PrinciplesSection />
        <InteractiveDemoSection />
        <CtaSection />
      </main>
    </div>
  )
}
