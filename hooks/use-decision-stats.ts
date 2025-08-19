import { getRecommendation, getRecommendationFromDecision, getRecommendationLabel } from "@/lib/services/recommendation-service"
import type { Decision } from "@/types/decision"

export function useDecisionStats() {
  const getDecisionStats = (decision: Decision) => {
    const argumentsArray = decision.arguments || []
    const positiveScore = argumentsArray.filter(arg => arg?.note > 0).reduce((sum, arg) => sum + (arg?.note || 0), 0)
    const negativeScore = Math.abs(argumentsArray.filter(arg => arg?.note < 0).reduce((sum, arg) => sum + (arg?.note || 0), 0))
    const recommendation = getRecommendationFromDecision(decision)

    return { negativeScore, positiveScore, recommendation }
  }

  return {
    getDecisionStats,
    getRecommendation, // Exposition de la fonction unifiée
    getRecommendationLabel // Exposition pour l'affichage
  }
}
