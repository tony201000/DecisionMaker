import { create } from "zustand"
import { createJSONStorage, devtools, persist } from "zustand/middleware"

interface UIState {
  // Navigation & Layout
  sidebarOpen: boolean
  currentPage: string
  breadcrumbs: Array<{ label: string; href: string }>

  // Modal & Dialog states
  modals: {
    deleteConfirm: boolean
    renameDialog: boolean
    settingsModal: boolean
  }

  // Loading states for UI operations
  ui: {
    savingDecision: boolean
    generatingSuggestions: boolean
    deletingDecision: boolean
  }
}

interface UIActions {
  // Navigation actions
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setCurrentPage: (page: string) => void
  setBreadcrumbs: (breadcrumbs: UIState["breadcrumbs"]) => void

  // Modal actions
  openModal: (modal: keyof UIState["modals"]) => void
  closeModal: (modal: keyof UIState["modals"]) => void
  closeAllModals: () => void

  // UI state actions
  setUILoading: (key: keyof UIState["ui"], loading: boolean) => void
}

export type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, _get) => ({
        breadcrumbs: [],

        closeAllModals: () =>
          set(
            {
              modals: {
                deleteConfirm: false,
                renameDialog: false,
                settingsModal: false
              }
            },
            false,
            "closeAllModals"
          ),

        closeModal: modal =>
          set(
            state => ({
              modals: { ...state.modals, [modal]: false }
            }),
            false,
            "closeModal"
          ),
        currentPage: "decision",
        modals: {
          deleteConfirm: false,
          renameDialog: false,
          settingsModal: false
        },

        // Modal actions
        openModal: modal =>
          set(
            state => ({
              modals: { ...state.modals, [modal]: true }
            }),
            false,
            "openModal"
          ),

        setBreadcrumbs: breadcrumbs => set({ breadcrumbs }, false, "setBreadcrumbs"),

        setCurrentPage: page => set({ currentPage: page }, false, "setCurrentPage"),

        // Navigation actions
        setSidebarOpen: open => set({ sidebarOpen: open }, false, "setSidebarOpen"),

        // UI state actions
        setUILoading: (key, loading) =>
          set(
            state => ({
              ui: { ...state.ui, [key]: loading }
            }),
            false,
            "setUILoading"
          ),
        // Initial state
        sidebarOpen: false,

        toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen }), false, "toggleSidebar"),
        ui: {
          deletingDecision: false,
          generatingSuggestions: false,
          savingDecision: false
        }
      }),
      {
        name: "decision-maker-ui",
        // Only persist UI preferences, not temporary states
        partialize: state => ({
          sidebarOpen: state.sidebarOpen
        }),
        storage: createJSONStorage(() => localStorage)
      }
    ),
    {
      name: "UIStore"
    }
  )
)

// Selectors pour optimiser les re-renders
export const useSidebarOpen = () => useUIStore(state => state.sidebarOpen)
export const useModals = () => useUIStore(state => state.modals)
export const useUILoading = () => useUIStore(state => state.ui)
