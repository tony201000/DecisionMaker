import { CtaSection as SharedCtaSection } from "@/components/shared/cta-section"

export function CtaSection() {
  return (
    <SharedCtaSection
      title="Rejoignez nos clients satisfaits"
      description="Commencez dès aujourd'hui à transformer vos décisions avec DecisionAI."
      primaryButton={{
        href: "/demo",
        text: "Essayer gratuitement"
      }}
      secondaryButton={{
        href: "/sign-up",
        text: "Créer un compte"
      }}
    />
  )
}
