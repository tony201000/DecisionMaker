"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AISuggestionsPanel, ArgumentList, NewArgumentForm } from "@/features/decision/components"
import type { Argument } from "@/types/decision"

interface ArgumentsSectionProps {
  newArgument: { text: string; weight: number }
  setNewArgument: (arg: { text: string; weight: number }) => void
  onAddArgument: () => void
  sortedArguments: Argument[]
  onRemoveArgument: (id: string) => void
  onUpdateArgumentWeight: (id: string, weight: number) => void
  decisionTitle: string
  onGenerateSuggestions: () => void
}

export const ArgumentsSection = React.memo(function ArgumentsSection({
  newArgument,
  setNewArgument,
  onAddArgument,
  sortedArguments,
  onRemoveArgument,
  onUpdateArgumentWeight,
  decisionTitle,
  onGenerateSuggestions
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
          />
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {/* AI Suggestions */}
      {decisionTitle && (
        <div className="relative">
          <AISuggestionsPanel
            decisionTitle={decisionTitle}
            onGenerateSuggestions={onGenerateSuggestions}
          />
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
