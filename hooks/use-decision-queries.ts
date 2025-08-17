import type { User } from "@supabase/supabase-js"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { DecisionCrudService } from "@/lib/services/decision-crud-service"
import type { Argument, Decision } from "@/types/decision"

const decisionCrudService = new DecisionCrudService()

// Queries
export const useDecisionHistory = (user: User | null) => {
  return useQuery<Decision[], Error>({
    enabled: !!user,
    queryFn: () => decisionCrudService.loadDecisionHistory(user),
    queryKey: ["decisionHistory", user?.id],
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}

export const useDecisionById = (decisionId: string | null) => {
  return useQuery<Decision | null, Error>({
    enabled: !!decisionId,
    queryFn: () => {
      if (!decisionId) {
        throw new Error("Decision ID is required")
      }
      return decisionCrudService.loadDecisionById(decisionId)
    },
    queryKey: ["decision", decisionId],
    staleTime: 1000 * 60 * 5 // 5 minutes
  })
}

// Mutations
export const useSaveDecision = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ user, decision, args }: { user: User | null; decision: Omit<Decision, "id" | "createdAt" | "updatedAt">; args: Argument[] }) =>
      decisionCrudService.saveDecision(user, decision, args),
    onSuccess: (_savedDecision, { user }) => {
      if (user) {
        // Invalidate decision history to refresh the list
        queryClient.invalidateQueries({ queryKey: ["decisionHistory", user.id] })
      }
    }
  })
}

export const useUpdateDecision = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ user, decision, args }: { user: User | null; decision: Decision; args: Argument[] }) =>
      decisionCrudService.updateDecision(user, decision, args),
    onSuccess: (updatedDecision, { user, decision }) => {
      if (user) {
        // Invalidate decision history to refresh the list
        queryClient.invalidateQueries({ queryKey: ["decisionHistory", user.id] })
        // Update the specific decision in cache
        queryClient.setQueryData(["decision", decision.id], updatedDecision)
      }
    }
  })
}

export const useDeleteDecision = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ user, decisionId }: { user: User | null; decisionId: string }) => decisionCrudService.deleteDecision(user, decisionId),
    onSuccess: (_, { user }) => {
      if (user) {
        // Invalidate decision history to refresh the list
        queryClient.invalidateQueries({ queryKey: ["decisionHistory", user.id] })
      }
    }
  })
}

export const useRenameDecision = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ user, decisionId, newTitle }: { user: User | null; decisionId: string; newTitle: string }) =>
      decisionCrudService.renameDecision(user, decisionId, newTitle),
    onSuccess: (_, { user }) => {
      if (user) {
        // Invalidate decision history to refresh the list
        queryClient.invalidateQueries({ queryKey: ["decisionHistory", user.id] })
      }
    }
  })
}

export const usePinDecision = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ user, decisionId }: { user: User | null; decisionId: string }) => decisionCrudService.pinDecision(user, decisionId),
    onSuccess: (_, { user }) => {
      if (user) {
        // Invalidate decision history to refresh the list
        queryClient.invalidateQueries({ queryKey: ["decisionHistory", user.id] })
      }
    }
  })
}

export const useGenerateSuggestions = () => {
  return useMutation({
    mutationFn: ({ decision, args }: { decision: Pick<Decision, "title" | "description">; args: Argument[] }) =>
      decisionCrudService.generateSuggestions(decision, args)
  })
}
