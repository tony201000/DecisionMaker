import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { AISuggestion } from "@/types/decision"

interface SuggestionsState {
  // Current suggestions
  suggestions: AISuggestion[]

  // Loading states
  isGenerating: boolean

  // Error state
  error: string | null

  // Suggestions history (for undo functionality)
  suggestionsHistory: AISuggestion[][]

  // UI states
  expandedSuggestions: Set<string> // Track which suggestions are expanded
  pinnedSuggestions: Set<string> // Track which suggestions are pinned

  // Filters and sorting
  filters: {
    showPositiveOnly: boolean
    showNegativeOnly: boolean
    minWeight: number
    maxWeight: number
  }

  // Generation parameters (for regeneration)
  lastGenerationParams: {
    title: string
    description: string
    existingArgumentsCount: number
  } | null
}

interface SuggestionsActions {
  // Suggestions management
  setSuggestions: (suggestions: AISuggestion[]) => void
  addSuggestion: (suggestion: AISuggestion) => void
  removeSuggestion: (index: number) => void
  clearSuggestions: () => void

  // Loading and error states
  setIsGenerating: (generating: boolean) => void
  setError: (error: string | null) => void

  // History management
  saveToHistory: () => void
  restoreFromHistory: (index: number) => void
  clearHistory: () => void

  // UI state management
  toggleSuggestionExpanded: (suggestionId: string) => void
  toggleSuggestionPinned: (suggestionId: string) => void
  clearUIState: () => void

  // Filters
  setFilter: <K extends keyof SuggestionsState["filters"]>(key: K, value: SuggestionsState["filters"][K]) => void
  resetFilters: () => void

  // Generation parameters
  setLastGenerationParams: (params: SuggestionsState["lastGenerationParams"]) => void

  // Derived getters
  getFilteredSuggestions: () => AISuggestion[]
  getPositiveSuggestions: () => AISuggestion[]
  getNegativeSuggestions: () => AISuggestion[]
  getPinnedSuggestions: () => AISuggestion[]
}

type SuggestionsStore = SuggestionsState & SuggestionsActions

const initialFilters: SuggestionsState["filters"] = {
  maxWeight: 10,
  minWeight: -10,
  showNegativeOnly: false,
  showPositiveOnly: false
}

export const useSuggestionsStore = create<SuggestionsStore>()(
  devtools(
    (set, get) => ({
      addSuggestion: suggestion =>
        set(
          state => ({
            suggestions: [...state.suggestions, suggestion]
          }),
          false,
          "addSuggestion"
        ),

      clearHistory: () => set({ suggestionsHistory: [] }, false, "clearHistory"),

      clearSuggestions: () =>
        set(
          {
            error: null,
            expandedSuggestions: new Set(),
            pinnedSuggestions: new Set(),
            suggestions: []
          },
          false,
          "clearSuggestions"
        ),

      clearUIState: () =>
        set(
          {
            expandedSuggestions: new Set(),
            pinnedSuggestions: new Set()
          },
          false,
          "clearUIState"
        ),
      error: null,
      expandedSuggestions: new Set(),
      filters: { ...initialFilters },

      // Derived getters
      getFilteredSuggestions: () => {
        const { suggestions, filters } = get()
        return suggestions.filter(suggestion => {
          if (filters.showPositiveOnly && suggestion.weight <= 0) return false
          if (filters.showNegativeOnly && suggestion.weight >= 0) return false
          if (suggestion.weight < filters.minWeight) return false
          if (suggestion.weight > filters.maxWeight) return false
          return true
        })
      },

      getNegativeSuggestions: () => {
        const { suggestions } = get()
        return suggestions.filter(s => s.weight < 0)
      },

      getPinnedSuggestions: () => {
        const { suggestions, pinnedSuggestions } = get()
        return suggestions.filter((_, index) => pinnedSuggestions.has(index.toString()))
      },

      getPositiveSuggestions: () => {
        const { suggestions } = get()
        return suggestions.filter(s => s.weight > 0)
      },
      isGenerating: false,
      lastGenerationParams: null,
      pinnedSuggestions: new Set(),

      removeSuggestion: index =>
        set(
          state => ({
            suggestions: state.suggestions.filter((_, i) => i !== index)
          }),
          false,
          "removeSuggestion"
        ),

      resetFilters: () => set({ filters: { ...initialFilters } }, false, "resetFilters"),

      restoreFromHistory: index => {
        const { suggestionsHistory } = get()
        if (index >= 0 && index < suggestionsHistory.length) {
          set({ suggestions: suggestionsHistory[index] }, false, "restoreFromHistory")
        }
      },

      // History management
      saveToHistory: () =>
        set(
          state => ({
            suggestionsHistory: [...state.suggestionsHistory, state.suggestions].slice(-10) // Keep last 10
          }),
          false,
          "saveToHistory"
        ),

      setError: error => set({ error, isGenerating: false }, false, "setError"),

      // Filters
      setFilter: (key, value) =>
        set(
          state => ({
            filters: { ...state.filters, [key]: value }
          }),
          false,
          "setFilter"
        ),

      // Loading and error states
      setIsGenerating: generating => set({ isGenerating: generating }, false, "setIsGenerating"),

      // Generation parameters
      setLastGenerationParams: params => set({ lastGenerationParams: params }, false, "setLastGenerationParams"),

      // Suggestions management
      setSuggestions: suggestions => set({ error: null, suggestions }, false, "setSuggestions"),
      // Initial state
      suggestions: [],
      suggestionsHistory: [],

      // UI state management
      toggleSuggestionExpanded: suggestionId =>
        set(
          state => {
            const newExpanded = new Set(state.expandedSuggestions)
            if (newExpanded.has(suggestionId)) {
              newExpanded.delete(suggestionId)
            } else {
              newExpanded.add(suggestionId)
            }
            return { expandedSuggestions: newExpanded }
          },
          false,
          "toggleSuggestionExpanded"
        ),

      toggleSuggestionPinned: suggestionId =>
        set(
          state => {
            const newPinned = new Set(state.pinnedSuggestions)
            if (newPinned.has(suggestionId)) {
              newPinned.delete(suggestionId)
            } else {
              newPinned.add(suggestionId)
            }
            return { pinnedSuggestions: newPinned }
          },
          false,
          "toggleSuggestionPinned"
        )
    }),
    {
      name: "SuggestionsStore"
    }
  )
)

// Selectors pour optimiser les re-renders
export const useSuggestions = () => useSuggestionsStore(state => state.suggestions)
export const useIsGeneratingSuggestions = () => useSuggestionsStore(state => state.isGenerating)
export const useSuggestionsError = () => useSuggestionsStore(state => state.error)
export const useSuggestionsFilters = () => useSuggestionsStore(state => state.filters)
export const useSuggestionsHistory = () => useSuggestionsStore(state => state.suggestionsHistory)

// Computed selectors
export const useFilteredSuggestions = () => useSuggestionsStore(state => state.getFilteredSuggestions())
export const usePositiveSuggestions = () => useSuggestionsStore(state => state.getPositiveSuggestions())
export const useNegativeSuggestions = () => useSuggestionsStore(state => state.getNegativeSuggestions())
export const usePinnedSuggestions = () => useSuggestionsStore(state => state.getPinnedSuggestions())

// UI state selectors
export const useExpandedSuggestions = () => useSuggestionsStore(state => state.expandedSuggestions)
export const usePinnedSuggestionsSet = () => useSuggestionsStore(state => state.pinnedSuggestions)
