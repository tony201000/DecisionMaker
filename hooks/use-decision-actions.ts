import { useAuth } from "@/hooks/use-auth"
import { useDeleteDecision, usePinDecision, useRenameDecision } from "@/hooks/use-decision-queries"

/**
 * Hook personnalisé qui centralise les actions sur les décisions
 * (renommer, supprimer, épingler) pour éviter la duplication de code
 */
export function useDecisionActions() {
  const { user } = useAuth()

  // React Query mutations for decision operations
  const deleteDecisionMutation = useDeleteDecision()
  const renameDecisionMutation = useRenameDecision()
  const pinDecisionMutation = usePinDecision()

  // Versions async pour usage direct
  const handleDecisionRenameAsync = async (id: string, title: string) => {
    if (user) {
      return renameDecisionMutation.mutateAsync({ decisionId: id, newTitle: title, user })
    }
    throw new Error("User not authenticated")
  }

  const handleDecisionDeleteAsync = async (id: string) => {
    if (user) {
      return deleteDecisionMutation.mutateAsync({ decisionId: id, user })
    }
    throw new Error("User not authenticated")
  }

  const handleDecisionPinAsync = async (id: string) => {
    if (user) {
      return pinDecisionMutation.mutateAsync({ decisionId: id, user })
    }
    throw new Error("User not authenticated")
  }

  // Versions sync pour compatibilité avec les props existantes (sidebar)
  const handleDecisionRename = (id: string, title: string) => {
    if (user) {
      renameDecisionMutation.mutate({ decisionId: id, newTitle: title, user })
    }
  }

  const handleDecisionDelete = (id: string) => {
    if (user) {
      deleteDecisionMutation.mutate({ decisionId: id, user })
    }
  }

  const handleDecisionPin = (id: string) => {
    if (user) {
      pinDecisionMutation.mutate({ decisionId: id, user })
    }
  }

  return {
    // Mutations brutes pour usage avancé si nécessaire
    deleteDecisionMutation,

    // Erreurs des mutations
    deleteError: deleteDecisionMutation.error,
    handleDecisionDelete,
    handleDecisionDeleteAsync,
    handleDecisionPin,
    handleDecisionPinAsync,
    // Handlers synchrones pour compatibilité (sidebar)
    handleDecisionRename,

    // Handlers async pour usage direct (composants)
    handleDecisionRenameAsync,

    // États des mutations pour l'UI
    isDeleting: deleteDecisionMutation.isPending,
    isPinning: pinDecisionMutation.isPending,
    isRenaming: renameDecisionMutation.isPending,
    pinDecisionMutation,
    pinError: pinDecisionMutation.error,
    renameDecisionMutation,
    renameError: renameDecisionMutation.error
  }
}
