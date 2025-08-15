"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Sparkles } from "lucide-react"
import { useRef, useEffect } from "react"
import type { Argument, AISuggestion } from "@/types/decision"

interface ArgumentsSectionProps {
  newArgument: { text: string; weight: number }
  setNewArgument: (arg: { text: string; weight: number }) => void
  onAddArgument: () => void
  sortedArguments: Argument[]
  onRemoveArgument: (id: string) => void
  onUpdateArgumentWeight: (id: string, weight: number) => void
  decisionTitle: string
  aiSuggestions: AISuggestion[]
  loadingSuggestions: boolean
  onGenerateSuggestions: () => void
  onAddSuggestion: (suggestion: AISuggestion) => void
}

export function ArgumentsSection({
  newArgument,
  setNewArgument,
  onAddArgument,
  sortedArguments,
  onRemoveArgument,
  onUpdateArgumentWeight,
  decisionTitle,
  aiSuggestions,
  loadingSuggestions,
  onGenerateSuggestions,
  onAddSuggestion,
}: ArgumentsSectionProps) {
  const sliderRef = useRef<HTMLDivElement>(null)

  const ratings = Array.from({ length: 21 }, (_, i) => i - 10)

  const getGradient = (val: number) => {
    if (val <= -8) return "bg-red-600 text-white"
    if (val <= -5) return "bg-red-500 text-white"
    if (val <= -2) return "bg-orange-400 text-white"
    if (val < 0) return "bg-yellow-400 text-black"
    if (val === 0) return "bg-gray-300 text-black"
    if (val <= 2) return "bg-lime-400 text-black"
    if (val <= 5) return "bg-green-400 text-white"
    if (val <= 8) return "bg-green-500 text-white"
    return "bg-green-600 text-white"
  }

  const getArgumentColor = (weight: number) => {
    if (weight < 0) return "border-red-200 dark:border-red-800"
    if (weight > 0) return "border-green-200 dark:border-green-800"
    return "border-gray-200 dark:border-gray-800"
  }

  const getBadgeColor = (weight: number) => {
    if (weight < 0) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    if (weight > 0) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  // Center slider on selected value
  useEffect(() => {
    if (sliderRef.current) {
      const selectedIndex = ratings.indexOf(newArgument.weight)
      const buttonWidth = 48 // w-12 = 48px
      const containerWidth = sliderRef.current.clientWidth
      const scrollPosition = selectedIndex * buttonWidth - containerWidth / 2 + buttonWidth / 2
      sliderRef.current.scrollTo({ left: Math.max(0, scrollPosition), behavior: "smooth" })
    }
  }, [newArgument.weight, ratings])

  return (
    <div className="space-y-6">
      {/* Add New Argument */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Ajouter un Argument</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Argument</Label>
            <Textarea
              placeholder="Décrivez votre argument..."
              value={newArgument.text}
              onChange={(e) => setNewArgument({ ...newArgument, text: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Note (-10 à +10)</Label>
            <div
              ref={sliderRef}
              className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {ratings.map((rating) => (
                <button
                  key={rating}
                  onClick={() => setNewArgument({ ...newArgument, weight: rating })}
                  className={`
                    w-12 h-12 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0
                    ${getGradient(rating)}
                    ${newArgument.weight === rating ? "ring-2 ring-primary scale-110" : "hover:scale-105"}
                  `}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={onAddArgument} disabled={!newArgument.text.trim()} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {decisionTitle && (
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
              disabled={loadingSuggestions || !decisionTitle.trim()}
              variant="outline"
              className="w-full bg-transparent"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loadingSuggestions ? "Génération..." : "Générer des suggestions"}
            </Button>

            {aiSuggestions.length > 0 && (
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{suggestion.text}</p>
                        <p className="text-sm text-muted-foreground mt-1">{suggestion.reasoning}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getBadgeColor(suggestion.weight)}>
                          {suggestion.weight > 0 ? "+" : ""}
                          {suggestion.weight}
                        </Badge>
                        <Button size="sm" onClick={() => onAddSuggestion(suggestion)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Arguments List */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Arguments Ajoutés ({sortedArguments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedArguments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Aucun argument ajouté pour le moment</div>
          ) : (
            <div className="space-y-3">
              {sortedArguments.map((argument) => (
                <div key={argument.id} className={`p-4 border rounded-lg ${getArgumentColor(argument.weight)}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{argument.text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getBadgeColor(argument.weight)}>
                        {argument.weight > 0 ? "+" : ""}
                        {argument.weight}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => onRemoveArgument(argument.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
