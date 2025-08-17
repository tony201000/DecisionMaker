"use client"

import { Check, Edit2, Plus, Sparkles, X } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { RecommendationBadge } from "@/components/ui/recommendation-badge"
import { Textarea } from "@/components/ui/textarea"
import type { AISuggestion } from "@/types/decision"
import { getGradient } from "@/utils/decision-styles"

interface AISuggestionsPanelProps {
  decisionTitle: string
  aiSuggestions: AISuggestion[]
  loadingSuggestions: boolean
  onGenerateSuggestions: () => void
  onAddSuggestion: (suggestion: AISuggestion) => void
}

export const AISuggestionsPanel: React.FC<AISuggestionsPanelProps> = ({
  decisionTitle,
  aiSuggestions,
  loadingSuggestions,
  onGenerateSuggestions,
  onAddSuggestion
}) => {
  const [editingSuggestions, setEditingSuggestions] = useState<{
    [key: number]: { text: string; weight: number }
  }>({})

  const ratings = Array.from({ length: 21 }, (_, i) => i - 10)

  const startEditingSuggestion = (index: number, suggestion: AISuggestion) => {
    setEditingSuggestions(prev => ({
      ...prev,
      [index]: { text: suggestion.text, weight: suggestion.weight }
    }))
  }

  const updateSuggestionEdit = (index: number, field: "text" | "weight", value: string | number) => {
    setEditingSuggestions(prev => ({
      ...prev,
      [index]: { ...prev[index], [field]: value }
    }))
  }

  const saveSuggestionEdit = (index: number, originalSuggestion: AISuggestion) => {
    const edited = editingSuggestions[index]
    if (edited?.text.trim()) {
      onAddSuggestion({
        ...originalSuggestion,
        text: edited.text,
        weight: edited.weight
      })
    }
    setEditingSuggestions(prev => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
  }

  const cancelSuggestionEdit = (index: number) => {
    setEditingSuggestions(prev => {
      const newState = { ...prev }
      delete newState[index]
      return newState
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Suggestions IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={onGenerateSuggestions}
          disabled={loadingSuggestions || !decisionTitle?.trim()}
          variant="outline"
          className="w-full bg-transparent"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {loadingSuggestions ? (
            <LoadingSpinner
              isLoading={loadingSuggestions}
              message="Génération..."
            />
          ) : (
            "Générer des suggestions"
          )}
        </Button>

        {aiSuggestions.length > 0 && (
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.text}
                className="p-4 border rounded-lg bg-muted/50 space-y-2"
              >
                {editingSuggestions[index] ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editingSuggestions[index].text}
                      onChange={e => updateSuggestionEdit(index, "text", e.target.value)}
                      rows={2}
                      className="w-full"
                    />
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Note:</Label>
                      <div className="flex gap-1 overflow-x-auto">
                        {ratings.map(rating => {
                          const baseClasses = "w-8 h-8 rounded text-xs font-medium transition-all duration-200 flex-shrink-0"
                          const gradientClass = getGradient(rating)
                          const isSelected = editingSuggestions[index]?.weight === rating
                          const selectionClass = isSelected ? "ring-2 ring-primary scale-110" : "hover:scale-105"
                          const finalClassName = `${baseClasses} ${gradientClass} ${selectionClass}`

                          return (
                            <button
                              type="button"
                              key={rating}
                              onClick={() => updateSuggestionEdit(index, "weight", rating)}
                              className={finalClassName}
                            >
                              {rating}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveSuggestionEdit(index, suggestion)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Ajouter
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => cancelSuggestionEdit(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium">{suggestion.text}</p>
                      <p className="text-sm text-muted-foreground mt-1">{suggestion.reasoning}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <RecommendationBadge
                        recommendation={suggestion.weight > 0 ? "Favorable" : suggestion.weight < 0 ? "Défavorable" : "Aucune donnée"}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditingSuggestion(index, suggestion)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onAddSuggestion(suggestion)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
