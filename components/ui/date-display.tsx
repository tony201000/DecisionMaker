import type React from "react"
import { cn } from "@/lib/utils"

interface DateDisplayProps {
  date: string | Date
  className?: string
}

export const DateDisplay: React.FC<DateDisplayProps> = ({ date, className }) => {
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  })

  // Check if the date is valid
  const isValidDate = !Number.isNaN(new Date(date).getTime())

  return <div className={cn("text-xs text-muted-foreground", className)}>{isValidDate ? formattedDate : "—"}</div>
}
