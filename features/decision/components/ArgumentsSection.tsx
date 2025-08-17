"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AISuggestionsPanel, ArgumentList, NewArgumentForm } from "@/features/decision/components"
import type { AISuggestion, Argument } from "@/types/decision"

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
  validationErrors: string[]
}

export const ArgumentsSection = React.memo(function ArgumentsSection({
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
  validationErrors
}: ArgumentsSectionProps) {
  return (
    <div className="space-y-6">
      {/* Add New Argument */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Ajouter un Argument</CardTitle>
        </CardHeader>
        <CardContent>
          <NewArgumentForm
            newArgument={newArgument}
            setNewArgument={setNewArgument}
            onAddArgument={onAddArgument}
            validationErrors={validationErrors}
          />
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {decisionTitle && (
        <div className="relative">
          <AISuggestionsPanel
            decisionTitle={decisionTitle}
            aiSuggestions={aiSuggestions}
            loadingSuggestions={loadingSuggestions}
            onGenerateSuggestions={onGenerateSuggestions}
            onAddSuggestion={onAddSuggestion}
          />
          {loadingSuggestions && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
              <LoadingSpinner
                isLoading={loadingSuggestions}
                message="Génération des suggestions..."
              />
            </div>
          )}
        </div>
      )}

      {/* Arguments List */}
      <ArgumentList
        arguments={sortedArguments}
        onRemoveArgument={onRemoveArgument}
        onUpdateArgumentWeight={onUpdateArgumentWeight}
        onUpdateArgumentText={(_id, _text) => {
          //TODO: // If you want to update the text, you should have a separate handler for updating text.
          // Here, just leave this empty or implement a proper handler if needed.
        }}
      />
    </div>
  )
})
