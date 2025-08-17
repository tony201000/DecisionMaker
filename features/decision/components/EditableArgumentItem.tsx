"use client"

import { X } from "lucide-react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { RecommendationBadge } from "@/components/ui/recommendation-badge"
import { RatingSlider } from "@/features/decision/components"
import type { Argument } from "@/types/decision"

interface EditableArgumentItemProps {
  argument: Argument
  onRemove: (id: string) => void
  onUpdateWeight: (id: string, weight: number) => void
  onUpdateText: (id: string, text: string) => void
}

export const EditableArgumentItem: React.FC<EditableArgumentItemProps> = ({ argument, onRemove, onUpdateWeight, onUpdateText }) => {
  // Convert numeric weight to recommendation text
  const getRecommendationText = (weight: number) => {
    if (weight > 0) return "Favorable"
    if (weight < 0) return "Défavorable"
    return "Aucune donnée"
  }

  return (
    <div className={`p-4 border rounded-lg space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium flex-1">{argument.text}</p>
        <div className="flex items-center gap-2">
          <RecommendationBadge recommendation={getRecommendationText(argument.weight)} />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(argument.id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <RatingSlider
        value={argument.weight}
        onChange={(weight: number, text: string) => {
          onUpdateWeight(argument.id, weight), onUpdateText(argument.id, text)
        }}
      />
    </div>
  )
}
