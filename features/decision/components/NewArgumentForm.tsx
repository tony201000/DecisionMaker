"use client"

import { Plus } from "lucide-react"
import type React from "react"
import { useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DECISION_CONSTANTS } from "@/lib/constants"
import { getGradient } from "@/lib/utils/decision-styles"

interface NewArgumentFormProps {
  newArgument: { text: string; weight: number }
  setNewArgument: (arg: { text: string; weight: number }) => void
  onAddArgument: () => void
}

export const NewArgumentForm: React.FC<NewArgumentFormProps> = ({ newArgument, setNewArgument, onAddArgument }) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const ratings = useMemo(() => Array.from({ length: 21 }, (_, i) => i - 10), [])
  const buttonWidth = 48 // w-12 = 48px

  // Center slider on selected value
  useEffect(() => {
    if (sliderRef.current) {
      const selectedIndex = ratings.indexOf(newArgument.weight)
      const containerWidth = sliderRef.current.clientWidth
      const scrollPosition = selectedIndex * buttonWidth - containerWidth / 2 + buttonWidth / 2
      sliderRef.current.scrollTo({
        behavior: "smooth",
        left: Math.max(0, scrollPosition)
      })
    }
  }, [newArgument.weight, ratings])

  const remainingChars = DECISION_CONSTANTS.MAX_ARGUMENT_LENGTH - newArgument.text.length

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Argument</Label>
          <span className={`text-xs ${remainingChars < 0 ? "text-destructive" : "text-muted-foreground"}`}>{remainingChars} caractères restants</span>
        </div>
        <Textarea
          placeholder="Décrivez votre argument..."
          value={newArgument.text}
          onChange={e => setNewArgument({ ...newArgument, text: e.target.value })}
          rows={2}
          maxLength={DECISION_CONSTANTS.MAX_ARGUMENT_LENGTH}
          aria-describedby="argument-help"
        />
        <div
          id="argument-help"
          className="text-xs text-muted-foreground"
        >
          Décrivez un point positif ou négatif concernant votre décision
        </div>
      </div>

      <div className="space-y-2">
        <Label>Note (-10 à +10)</Label>
        <div
          ref={sliderRef}
          className="flex gap-1 overflow-x-auto pb-2"
          role="radiogroup"
          aria-label="Sélectionner une note de -10 à +10"
        >
          {ratings.map(rating => (
            <label
              key={rating}
              className="relative"
            >
              <input
                type="radio"
                name="argument-weight"
                value={rating}
                checked={newArgument.weight === rating}
                onChange={() => setNewArgument({ ...newArgument, weight: rating })}
                className="sr-only"
                aria-label={`Note ${rating}`}
              />
              <span
                className={`
                  w-12 h-12 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 inline-flex items-center justify-center cursor-pointer
                  ${getGradient(rating)}
                  ${newArgument.weight === rating ? "ring-2 ring-primary scale-110" : "hover:scale-105"}
                `}
              >
                {rating}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Button
        onClick={onAddArgument}
        disabled={!newArgument?.text?.trim() || remainingChars < 0}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Ajouter
      </Button>
    </div>
  )
}
