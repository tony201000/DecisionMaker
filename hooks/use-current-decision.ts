import { NewArgumentSchema } from "@/features/decision/schemas"
import { DecisionCrudService } from "@/lib/services/decision-crud-service"
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

const decisionCrudService = new DecisionCrudService()

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
    loadDecision: async (decisionId: string) => {
      store.setCurrentDecisionId(decisionId)

      // ✅ CORRECTION CRITIQUE : Charger les données réelles au lieu de juste l'ID
      try {
        const decision = await decisionCrudService.loadDecisionById(decisionId)
        if (decision) {
          // Charger les données complètes dans le draft
          store.setDraftDecision({
            createdAt: decision.createdAt,
            description: decision.description,
            id: decision.id,
            title: decision.title,
            updatedAt: decision.updatedAt,
            version: decision.version
          })

          // Charger les arguments
          store.setDraftArguments(decision.arguments || [])

          // Marquer comme non modifié puisque les données viennent de la DB
          store.setHasUnsavedChanges(false)
        }
      } catch (error) {
        console.error("Error loading decision:", error)
        // En cas d'erreur, au moins s'assurer que l'ID est stocké
      }

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
    updateArgumentNote: (id: string, note: number) => store.updateDraftArgument(id, { note })
  }
}

/**
 * Hook pour le formulaire de nouvel argument
 */
export function useNewArgumentFormZustand() {
  const form = useNewArgumentForm()
  const { setNewArgumentFormOpen, setNewArgumentText, setNewArgumentNote, resetNewArgumentForm, addDraftArgument } = useDecisionStore()

  return {
    // Soumission avec validation Zod
    addArgument: () => {
      // ✅ VALIDATION ZOD - Remplace la validation trim() basique
      const result = NewArgumentSchema.safeParse({
        note: form.note,
        text: form.text
      })

      if (result.success) {
        addDraftArgument({
          note: result.data.note,
          text: result.data.text
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
      note: form.note,
      text: form.text
    },
    openForm: () => setNewArgumentFormOpen(true),
    resetForm: resetNewArgumentForm,

    // Actions
    setNewArgument: (arg: { text: string; note: number }) => {
      setNewArgumentText(arg.text)
      setNewArgumentNote(arg.note)
    },
    setNewArgumentNote,
    setNewArgumentText
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
