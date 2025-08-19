import { HeroSection as SharedHeroSection } from "@/components/shared/hero-section"

export function HeroSection() {
  return (
    <SharedHeroSection
      title={
        <>
          La Méthode <span className="text-primary">Schulich</span> Enrichie par l'IA
        </>
      }
      description="Découvrez comment notre plateforme s'appuie sur la méthode éprouvée de Seymour Schulich, enrichie par l'intelligence artificielle pour vous aider à prendre des décisions plus éclairées."
      primaryButton={{
        href: "/demo",
        text: "Voir la méthode en action"
      }}
      secondaryButton={{
        href: "/fonctionnalites",
        text: "Découvrir les fonctionnalités"
      }}
    />
  )
}
