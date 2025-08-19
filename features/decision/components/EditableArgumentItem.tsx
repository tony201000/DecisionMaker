"use client"

import { X } from "lucide-react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { RecommendationBadge } from "@/components/ui/recommendation-badge"
import { RatingSlider } from "@/features/decision/components"
import { getRecommendationFromNote, getRecommendationLabel } from "@/lib/services/recommendation-service"
import type { Argument } from "@/types/decision"

interface EditableArgumentItemProps {
  argument: Argument
  onRemove: (id: string) => void
  onUpdateNote: (id: string, note: number) => void
  onUpdateText: (id: string, text: string) => void
}

export const EditableArgumentItem: React.FC<EditableArgumentItemProps> = ({ argument, onRemove, onUpdateNote, onUpdateText }) => {
  // Use unified recommendation service
  const recommendation = getRecommendationFromNote(argument.note)
  const recommendationLabel = getRecommendationLabel(recommendation)

  return (
    <div className={`p-4 border rounded-lg space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium flex-1">{argument.text}</p>
        <div className="flex items-center gap-2">
          <RecommendationBadge recommendation={recommendationLabel} />
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
        value={argument.note}
        onChange={(note: number, text: string) => {
          onUpdateNote(argument.id, note)
          onUpdateText(argument.id, text)
        }}
      />
    </div>
  )
}
