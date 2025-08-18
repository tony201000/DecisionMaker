// Hooks de base (React Query + Zustand en interne)
export { useAISuggestions, useGenerateSuggestions } from "./use-ai-suggestions"
export { useAuth } from "./use-auth"
export { useAuthForm } from "./use-auth-form"
export { useArguments, useCurrentDecision } from "./use-current-decision"
export { useDebounce } from "./use-debounce"
export {
  useDecisionById,
  useDecisionHistory,
  useDeleteDecision,
  usePinDecision,
  useRenameDecision,
  useSaveDecision,
  useUpdateDecision
} from "./use-decision-queries"
export { useDecisionStats } from "./use-decision-stats"
export { useToast } from "./use-toast"
// Hooks UI Zustand
export { useLoadingStates, useModalState, useSidebar, useTheme, useUI } from "./use-ui"
