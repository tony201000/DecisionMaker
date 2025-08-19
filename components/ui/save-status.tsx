import type React from "react"
import { cn } from "@/lib/utils/decision-styles"

interface SaveStatusProps {
  isSaving: boolean
  className?: string
}

export const SaveStatus: React.FC<SaveStatusProps> = ({ isSaving, className }) => {
  if (!isSaving) {
    return null
  }

  return (
    <div className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
      Sauvegarde automatique
    </div>
  )
}
