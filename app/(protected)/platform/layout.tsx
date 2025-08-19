import type { Metadata } from "next"

export const metadata: Metadata = {
  description: "Plateforme de prise de décision utilisant la méthode Schulich enrichie par l'intelligence artificielle.",
  title: "DecisionAI Platform - Prise de Décision Assistée par IA"
}

/**
 * Layout platform simplifié - L'architecture globale est gérée au niveau app
 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return children
}
