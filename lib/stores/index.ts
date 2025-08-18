// Import stores for internal use
import { useAuthStore } from "./auth-store"
import { useDecisionStore } from "./decision-store"
import { useSuggestionsStore } from "./suggestions-store"
import { useUIStore } from "./ui-store"

// Export all stores and their selectors
export * from "./auth-store"
export { useAuthStore } from "./auth-store"
export * from "./decision-store"
export { useDecisionStore } from "./decision-store"
export * from "./suggestions-store"
export { useSuggestionsStore } from "./suggestions-store"
export * from "./ui-store"
// Main stores (re-export)
export { useUIStore } from "./ui-store"

// Helper function to reset all stores (useful for logout)
export const resetAllStores = () => {
  useUIStore.getState().closeAllModals()
  useDecisionStore.getState().resetStore()
  useSuggestionsStore.getState().clearSuggestions()
  useAuthStore.getState().setUser(null)
}
