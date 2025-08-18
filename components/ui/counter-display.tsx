import type React from "react"
import { cn } from "@/lib/utils/decision-styles"

interface CounterDisplayProps {
  count: number
  label: string
  pluralLabel?: string
  className?: string
}

export const CounterDisplay: React.FC<CounterDisplayProps> = ({ count, label, pluralLabel = `${label}s`, className }) => {
  // Determine the correct label based on count
  const displayLabel = count > 1 ? pluralLabel : label

  return (
    <div className={cn("text-xs text-muted-foreground", className)}>
      {count} {displayLabel}
    </div>
  )
}
