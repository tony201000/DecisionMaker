import { useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  type ConflictResolutionOptions,
  ConflictResolutionUI,
  isDuplicateTitleError,
  isOptimisticLockError,
  suggestAlternativeTitles
} from "@/lib/utils/decision-conflict-manager"
import type { DecisionOperationResult, DuplicateTitleError, OptimisticLockError } from "@/types/decision"

/**
 * Hook for handling decision conflicts with user-friendly UI interactions
 */
export function useDecisionConflictResolution() {
  const { addToast } = useToast()

  const handleOptimisticLockFailed = useCallback(
    async (_error: OptimisticLockError): Promise<boolean> => {
      // Show toast notification
      addToast({
        description: "Cette décision a été modifiée par un autre processus. Voulez-vous réessayer?",
        title: "Conflit détecté",
        variant: "destructive"
      })

      // For auto-save, we typically want to retry automatically
      // For manual saves, we might want to ask the user
      return true // Auto-retry for now
    },
    [addToast]
  )

  const handleDuplicateTitle = useCallback(
    async (error: DuplicateTitleError, suggestions: string[]): Promise<string> => {
      addToast({
        description: `Une décision avec le titre "${error.conflictingTitle}" existe déjà. Un nouveau titre a été généré automatiquement.`,
        title: "Titre déjà utilisé",
        variant: "destructive"
      })

      // For auto-save, automatically use the first suggestion
      return suggestions[0] || `${error.conflictingTitle} (${Date.now()})`
    },
    [addToast]
  )

  const conflictResolutionOptions: ConflictResolutionOptions = {
    onDuplicateTitle: handleDuplicateTitle,
    onOptimisticLockFailed: handleOptimisticLockFailed,
    showToasts: true
  }

  const conflictResolutionUI = new ConflictResolutionUI(conflictResolutionOptions)

  /**
   * Handles operation results and provides user feedback for conflicts
   */
  const handleOperationResult = useCallback(
    async <T>(result: DecisionOperationResult<T>): Promise<T> => {
      return await conflictResolutionUI.handleOperationResult(result)
    },
    [conflictResolutionUI]
  )

  /**
   * Safely execute an operation with conflict resolution
   */
  const executeWithConflictResolution = useCallback(
    async <T>(operation: () => Promise<DecisionOperationResult<T>>): Promise<T | null> => {
      try {
        const result = await operation()
        return await handleOperationResult(result)
      } catch (error) {
        if (isOptimisticLockError(error)) {
          addToast({
            description: "La décision a été modifiée pendant votre édition. Veuillez rafraîchir et réessayer.",
            title: "Conflit de version",
            variant: "destructive"
          })
        } else if (isDuplicateTitleError(error)) {
          const suggestions = suggestAlternativeTitles(error.conflictingTitle, [])
          addToast({
            description: `Le titre "${error.conflictingTitle}" est déjà utilisé. Suggestions: ${suggestions[0]}`,
            title: "Titre en conflit",
            variant: "destructive"
          })
        } else {
          addToast({
            description: error instanceof Error ? error.message : "Une erreur inattendue s'est produite",
            title: "Erreur",
            variant: "destructive"
          })
        }

        return null
      }
    },
    [handleOperationResult, addToast]
  )

  return {
    conflictResolutionOptions,
    executeWithConflictResolution,
    handleOperationResult,
    isDuplicateTitleError,
    // Utility functions for manual conflict detection
    isOptimisticLockError,
    suggestAlternativeTitles
  }
}

/**
 * Simplified hook for auto-save scenarios where we want minimal user interruption
 */
export function useAutoSaveConflictResolution() {
  const silentHandleOptimisticLockFailed = useCallback(async (_error: OptimisticLockError): Promise<boolean> => {
    // For auto-save, silently retry
    return true
  }, [])

  const silentHandleDuplicateTitle = useCallback(async (error: DuplicateTitleError, suggestions: string[]): Promise<string> => {
    // For auto-save, silently use the first suggestion
    return suggestions[0] || `${error.conflictingTitle} (${Date.now()})`
  }, [])

  const conflictResolutionOptions: ConflictResolutionOptions = {
    onDuplicateTitle: silentHandleDuplicateTitle,
    onOptimisticLockFailed: silentHandleOptimisticLockFailed,
    showToasts: false // Silent for auto-save
  }

  const conflictResolutionUI = new ConflictResolutionUI(conflictResolutionOptions)

  const handleOperationResult = useCallback(
    async <T>(result: DecisionOperationResult<T>): Promise<T | null> => {
      try {
        return await conflictResolutionUI.handleOperationResult(result)
      } catch (error) {
        // Log but don't show UI errors for auto-save
        console.warn("Auto-save conflict resolution failed:", error)
        return null
      }
    },
    [conflictResolutionUI]
  )

  return {
    conflictResolutionOptions,
    handleOperationResult
  }
}
