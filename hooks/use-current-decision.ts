import { useState } from "react"
import type { Decision } from "@/types/decision"
import { useAuth } from "./use-auth"
import { useDecisionById, useUpdateDecision } from "./use-decision-queries"

/**
 * Hook simplifié pour la gestion de la décision courante
 * Version temporaire sans store global complexe
 */
export function useCurrentDecision() {
  const { user } = useAuth()
  const [currentDecisionId, setCurrentDecisionId] = useState<string | null>(null)

  // État serveur géré par React Query
  const { data: currentDecision, isLoading, error } = useDecisionById(currentDecisionId)
  const updateDecisionMutation = useUpdateDecision()

  const loadDecision = (decisionId: string) => {
    setCurrentDecisionId(decisionId)
  }

  const createNewDecision = (clearCallback?: () => void) => {
    setCurrentDecisionId(null)
    if (clearCallback) {
      clearCallback()
    }
  }

  // Pour la compatibilité avec les composants existants qui attendent un objet Decision
  const getDefaultDecision = (): Decision => ({
    arguments: [],
    description: "",
    title: "Nouvelle décision"
  })

  // Fonction compatible pour mettre à jour une décision
  const setCurrentDecision = (decision: Decision | null) => {
    if (!decision) {
      setCurrentDecisionId(null)
      return
    }

    // Si la décision a un ID, on la met à jour via React Query
    if (decision.id && user) {
      updateDecisionMutation.mutate({
        args: decision.arguments || [],
        decision,
        user
      })
    }

    // Garder l'ID dans le state local pour le suivi
    if (decision.id) {
      setCurrentDecisionId(decision.id)
    }
  }

  return {
    createNewDecision,
    currentDecision: currentDecision || (currentDecisionId === null ? getDefaultDecision() : null),
    currentDecisionId,
    error,
    isLoading,
    loadDecision,
    setCurrentDecision
  }
}
