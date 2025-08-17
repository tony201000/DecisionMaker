import type React from "react"
import { cn } from "@/lib/utils"

interface RatioDisplayProps {
  ratio: number
  className?: string
}

export const RatioDisplay: React.FC<RatioDisplayProps> = ({ ratio, className }) => {
  // Format the ratio value
  const formattedRatio = ratio === Number.POSITIVE_INFINITY ? "∞" : ratio.toFixed(1)

  return (
    <div className={cn("text-center", className)}>
      <p className="text-sm text-muted-foreground">Ratio</p>
      <p className="text-2xl font-bold">{formattedRatio}:1</p>
    </div>
  )
}
