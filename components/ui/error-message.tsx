import type React from "react"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  message: string
  className?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  return (
    <div
      className={cn("text-sm text-destructive", className)}
      role="alert"
    >
      {message}
    </div>
  )
}
