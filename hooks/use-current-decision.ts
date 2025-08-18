import {
  useCurrentDecisionId,
  useDecisionScores,
  useDecisionStore,
  useDraftArguments,
  useDraftDecision,
  useHasUnsavedChanges,
  useIsEditing,
  useNewArgumentForm,
  useSortedDraftArguments
  // ❌ SUPPRIMÉ : useValidation (legacy)
} from "@/lib/stores"
import { NewArgumentSchema } from "@/features/decision/schemas"

/**
 * Hook d'interface pour la gestion de décision courante avec Zustand
 * Compatible avec l'API existante de use-current-decision.ts
 */
export function useCurrentDecision() {
  const store = useDecisionStore()

  return {
    clearDraft: store.clearDraft,
    // ❌ SUPPRIMÉ : clearValidationErrors (legacy)

    createNewDecision: () => {
      store.resetStore()
    },
    // État principal - API ZUSTAND PURE
    currentDecisionId: store.currentDecisionId,
    draftDecision: store.draftDecision,
    hasUnsavedChanges: store.hasUnsavedChanges,
    isEditing: store.isEditing,

    // Convenience methods
    loadDecision: (decisionId: string) => {
      store.setCurrentDecisionId(decisionId)
      store.setIsEditing(false)
    },

    // Actions principales
    setCurrentDecisionId: store.setCurrentDecisionId,
    setDraftDecision: store.setDraftDecision,
    setIsEditing: store.setIsEditing,
    // ❌ SUPPRIMÉ : setValidationError (legacy)

    startEditing: () => {
      store.setIsEditing(true)
    },

    stopEditing: () => {
      store.setIsEditing(false)
      store.setHasUnsavedChanges(false)
    },
    updateDraftField: store.updateDraftField
    // ❌ SUPPRIMÉ : validation (legacy)
  }
}

/**
 * Hook pour la gestion des arguments avec Zustand
 * API ZUSTAND PURE - pas de paramètres legacy
 */
export function useArguments() {
  const store = useDecisionStore()

  const positiveScore = store.getPositiveScore()
  const negativeScore = store.getNegativeScore()
  const sortedArguments = store.getSortedArguments()

  return {
    // Actions principales
    addArgument: store.addDraftArgument,

    // État
    args: store.draftArguments,
    clearArguments: store.clearDraftArguments,
    negativeScore,

    // Scores calculés
    positiveScore,
    removeArgument: store.removeDraftArgument,
    setArguments: store.setDraftArguments,
    sortedArguments,
    updateArgumentWeight: (id: string, weight: number) => store.updateDraftArgument(id, { weight })
  }
}

/**
 * Hook pour le formulaire de nouvel argument
 */
export function useNewArgumentFormZustand() {
  const form = useNewArgumentForm()
  const { setNewArgumentFormOpen, setNewArgumentText, setNewArgumentWeight, resetNewArgumentForm, addDraftArgument } = useDecisionStore()

  return {
    // Soumission avec validation Zod
    addArgument: () => {
      // ✅ VALIDATION ZOD - Remplace la validation trim() basique
      const result = NewArgumentSchema.safeParse({
        text: form.text,
        weight: form.weight
      })
      
      if (result.success) {
        addDraftArgument({
          text: result.data.text,
          weight: result.data.weight
        })
        resetNewArgumentForm()
      } else {
        // TODO: Gérer les erreurs Zod (sera fait dans la phase suivante)
        console.warn("Validation errors:", result.error.issues)
      }
    },
    closeForm: () => setNewArgumentFormOpen(false),
    isOpen: form.isOpen,
    // État du formulaire
    newArgument: {
      text: form.text,
      weight: form.weight
    },
    openForm: () => setNewArgumentFormOpen(true),
    resetForm: resetNewArgumentForm,

    // Actions
    setNewArgument: (arg: { text: string; weight: number }) => {
      setNewArgumentText(arg.text)
      setNewArgumentWeight(arg.weight)
    },
    setNewArgumentText,
    setNewArgumentWeight
  }
}

/**
 * Hook combiné pour toute la gestion des décisions
 * Centralise la logique des hooks actuels use-current-decision.ts et use-arguments.ts
 */
export function useDecisionManagement() {
  const decision = useCurrentDecision()
  const argumentsData = useArguments()
  const form = useNewArgumentForm()
  const scores = useDecisionScores()
  const { setHasUnsavedChanges } = useDecisionStore()

  return {
    // Décision
    ...decision,

    // Arguments
    ...argumentsData,

    // Formulaire
    newArgumentForm: form,

    resetAll: () => {
      useDecisionStore.getState().resetStore()
    },

    // Actions combinées
    saveDecision: () => {
      // Cette fonction sera appelée avec React Query
      // Mais l'état local sera géré par Zustand
      setHasUnsavedChanges(false)
    },

    // Scores calculés
    scores
  }
}

/**
 * Selectors optimisés pour éviter les re-renders
 */
export const useDecisionId = () => useCurrentDecisionId()
export const useDraft = () => useDraftDecision()
export const useEditingState = () => useIsEditing()
export const useUnsavedChanges = () => useHasUnsavedChanges()
export const useDraftArg = () => useDraftArguments()
export const useScores = () => useDecisionScores()
export const useSortedArgs = () => useSortedDraftArguments()
// ❌ SUPPRIMÉ : useFormValidation (legacy, utilisait useValidation supprimé)
