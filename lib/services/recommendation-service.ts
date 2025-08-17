import type { Decision } from "@/types/decision"

/**
 * Types de recommandation basés sur le schéma Zod
 * Correspond au schéma : recommendation: z.enum(["favorable", "defavorable", "incertain"])
 */
export type RecommendationType = "favorable" | "defavorable" | "incertain"

/**
 * Calcule la recommandation basée sur les scores positifs et négatifs
 * Logique unifiée pour remplacer toutes les implémentations dupliquées
 */
export function getRecommendation(positiveScore: number, negativeScore: number): RecommendationType {
  // Validation des entrées
  if (positiveScore < 0 || negativeScore < 0) {
    return "incertain"
  }

  // Si pas de scores, recommandation incertaine
  if (positiveScore === 0 && negativeScore === 0) {
    return "incertain"
  }

  // Calcul du ratio (éviter division par zéro)
  const ratio = negativeScore > 0 ? positiveScore / negativeScore : positiveScore > 0 ? Number.POSITIVE_INFINITY : 1

  // Seuils de décision (configurables si besoin)
  if (ratio >= 2) return "favorable"
  if (ratio <= 0.5) return "defavorable"
  return "incertain"
}

/**
 * Calcule la recommandation à partir d'une décision complète
 * Remplace la logique dupliquée dans decision-result, decision-chart, etc.
 */
export function getRecommendationFromDecision(decision: Decision): RecommendationType {
  const argumentsArray = decision.arguments || []
  const positiveScore = argumentsArray.filter(arg => arg?.weight > 0).reduce((sum, arg) => sum + (arg?.weight || 0), 0)
  const negativeScore = Math.abs(argumentsArray.filter(arg => arg?.weight < 0).reduce((sum, arg) => sum + (arg?.weight || 0), 0))

  return getRecommendation(positiveScore, negativeScore)
}

/**
 * Calcule la recommandation basée sur un poids individuel (pour EditableArgumentItem)
 * Remplace getRecommendationText dans EditableArgumentItem
 */
export function getRecommendationFromWeight(weight: number): RecommendationType {
  if (weight > 0) return "favorable"
  if (weight < 0) return "defavorable"
  return "incertain"
}

/**
 * Type pour les labels d'affichage des recommandations
 */
export type RecommendationLabelType = "Favorable" | "Défavorable" | "Mitigé" | "Aucune donnée"

/**
 * Obtient le texte d'affichage pour une recommandation
 * Utile pour l'UI (labels, descriptions, etc.)
 */
export function getRecommendationLabel(recommendation: RecommendationType): RecommendationLabelType {
  switch (recommendation) {
    case "favorable":
      return "Favorable"
    case "defavorable":
      return "Défavorable"
    case "incertain":
      return "Mitigé"
    default:
      return "Mitigé"
  }
}

/**
 * Obtient la couleur/variant pour une recommandation
 * Utile pour les badges, indicateurs visuels, etc.
 */
export function getRecommendationVariant(recommendation: RecommendationType): "success" | "destructive" | "secondary" {
  switch (recommendation) {
    case "favorable":
      return "success"
    case "defavorable":
      return "destructive"
    case "incertain":
      return "secondary"
    default:
      return "secondary"
  }
}
