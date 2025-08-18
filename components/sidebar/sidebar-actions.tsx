"use client"

import { Moon, Plus, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/use-ui"

interface SidebarActionsProps {
  onNewDecision: () => void
}

export const SidebarActions = ({ onNewDecision }: SidebarActionsProps) => {
  // ✅ ZUSTAND: État theme centralisé
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <div className="mt-6 space-y-3">
      <Button
        onClick={onNewDecision}
        className="w-full justify-start"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" /> Nouvelle décision
      </Button>

      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">Mode sombre</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="w-auto h-auto p-1"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
