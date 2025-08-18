import type React from "react"
import { cn } from "@/lib/utils/decision-styles"

interface ScoreDisplayProps {
  value: number
  label: string
  variant?: "positive" | "negative" | "positive-circle" | "negative-circle"
  className?: string
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ value, label, variant = "positive", className }) => {
  // Handle circle variants
  if (variant === "positive-circle" || variant === "negative-circle") {
    const isPositive = variant === "positive-circle"
    const bgColor = isPositive ? "bg-green-500" : "bg-red-500"
    const textColor = "text-white"
    const labelColor = isPositive ? "text-green-600" : "text-red-600"

    return (
      <div className="flex flex-col items-center">
        <div className={cn(`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${bgColor} ${textColor}`, className)}>
          {value}
        </div>
        <p className={cn("text-sm mt-2 font-medium", labelColor)}>{label}</p>
      </div>
    )
  }

  // Handle regular variants
  const colorClasses = variant === "positive" ? "text-green-600 dark:text-green-40" : "text-red-600 dark:text-red-400"

  return (
    <div className={cn("text-center", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses}`}>{value}</p>
    </div>
  )
}
