import { HeroSection as SharedHeroSection } from "@/components/shared/hero-section"

export function HeroSection() {
  return (
    <SharedHeroSection
      title={
        <>
          Ce que disent nos <span className="text-accent">clients</span>
        </>
      }
      description="Découvrez comment DecisionAI transforme la prise de décision dans des centaines d'entreprises à travers le monde."
      primaryButton={{
        href: "/demo",
        text: "Voir la démo"
      }}
      secondaryButton={{
        href: "/sign-up",
        text: "Rejoindre nos clients"
      }}
    />
  )
}
