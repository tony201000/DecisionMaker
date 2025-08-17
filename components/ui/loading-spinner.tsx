import type React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  isLoading: boolean
  message?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isLoading, message = "Chargement...", className }) => {
  if (!isLoading) {
    return null
  }

  return (
    <div className={cn("flex items-center justify-center text-muted-foreground", className)}>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
      {message}
    </div>
  )
}
