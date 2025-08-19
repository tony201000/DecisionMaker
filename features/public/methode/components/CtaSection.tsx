import { CtaSection as SharedCtaSection } from "@/components/shared/cta-section"

export function CtaSection() {
  return (
    <SharedCtaSection
      title="Maîtrisez la méthode Schulich"
      description="Transformez votre processus de décision avec une méthode éprouvée et l'intelligence artificielle."
      primaryButton={{
        href: "/demo",
        text: "Commencer la démo"
      }}
      secondaryButton={{
        href: "/sign-up",
        text: "Créer un compte gratuit"
      }}
    />
  )
}
