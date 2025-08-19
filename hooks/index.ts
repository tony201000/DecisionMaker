// Hooks de base (React Query + Zustand en interne)
export { useAISuggestions, useGenerateSuggestions } from "./use-ai-suggestions"
export { useAuth } from "./use-auth"
export { useAuthForm } from "./use-auth-form"
// ✅ Auto-save robuste avec UPSERT
export { useAutoSave } from "./use-auto-save"
export { useArguments, useCurrentDecision } from "./use-current-decision"
export { useDebounce } from "./use-debounce"
export { useDecisionActions } from "./use-decision-actions"
// ✅ Gestion des conflits et résolution d'erreurs
export { useAutoSaveConflictResolution, useDecisionConflictResolution } from "./use-decision-conflict-resolution"
export {
  useDecisionById,
  useDecisionHistory,
  useDeleteDecision,
  usePinDecision,
  useRenameDecision,
  useSaveDecision,
  useUpdateDecision,
  useUpdateDecisionWithLocking,
  // ✅ Nouveaux hooks robustes pour éviter les doublons
  useUpsertDecision
} from "./use-decision-queries"
export { useDecisionStats } from "./use-decision-stats"

export { useToast } from "./use-toast"
// Hooks UI Zustand
export { useLoadingStates, useModalState, useSidebar, useTheme, useUI } from "./use-ui"
