"use client"

import { Moon, Plus, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

interface SidebarActionsProps {
  onNewDecision: () => void
}

export const SidebarActions = ({ onNewDecision }: SidebarActionsProps) => {
  // ✅ Utilise next-themes au lieu de Zustand pour le thème
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

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
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="w-auto h-auto p-1"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}
