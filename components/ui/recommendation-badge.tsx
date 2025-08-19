import type React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/decision-styles"

interface RecommendationBadgeProps {
  recommendation: "Favorable" | "Défavorable" | "Mitigé" | "Aucune donnée"
  className?: string
}

export const RecommendationBadge: React.FC<RecommendationBadgeProps> = ({ recommendation, className }) => {
  // Determine the color classes based on recommendation
  const colorClasses = (() => {
    switch (recommendation) {
      case "Favorable":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 border-0"
      case "Défavorable":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border-0"
      case "Mitigé":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20 border-0"
      default: // "Aucune donnée"
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20 border-0"
    }
  })()

  return <Badge className={cn(colorClasses, className)}>{recommendation}</Badge>
}
