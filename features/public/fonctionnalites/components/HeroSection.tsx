import { HeroSection as SharedHeroSection } from "@/components/shared/hero-section"

export function HeroSection() {
  return (
    <SharedHeroSection
      title={
        <>
          Fonctionnalités <span className="text-accent">Puissantes</span>
        </>
      }
      description="Découvrez comment notre plateforme révolutionne votre processus de prise de décision avec des outils avancés et une interface intuitive."
      primaryButton={{
        href: "/demo",
        text: "Essayer la démo"
      }}
      secondaryButton={{
        href: "/sign-up",
        text: "Commencer gratuitement"
      }}
    />
  )
}
