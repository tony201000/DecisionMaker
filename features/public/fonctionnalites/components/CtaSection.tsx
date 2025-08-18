import { CtaSection as SharedCtaSection } from "@/components/shared/cta-section"

export function CtaSection() {
  return (
    <SharedCtaSection
      title="Prêt à transformer vos décisions ?"
      description="Rejoignez des milliers de professionnels qui optimisent leurs décisions avec notre plateforme."
      primaryButton={{
        href: "/demo",
        text: "Voir la démo interactive"
      }}
      secondaryButton={{
        href: "/sign-up",
        text: "Commencer maintenant"
      }}
    />
  )
}
