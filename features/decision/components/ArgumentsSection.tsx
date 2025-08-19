"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AISuggestionsPanel, ArgumentList, NewArgumentForm } from "@/features/decision/components"
import type { Argument } from "@/types/decision"
import type { NewArgument } from "../schemas"

interface ArgumentsSectionProps {
  newArgument: NewArgument
  setNewArgument: (arg: NewArgument) => void
  onAddArgument: () => void
  sortedArguments: Argument[]
  onRemoveArgument: (id: string) => void
  onUpdateArgumentNote: (id: string, note: number) => void
  decisionTitle: string
  onGenerateSuggestions: () => void
}

export const ArgumentsSection = React.memo(function ArgumentsSection({
  newArgument,
  setNewArgument,
  onAddArgument,
  sortedArguments,
  onRemoveArgument,
  onUpdateArgumentNote,
  decisionTitle,
  onGenerateSuggestions
}: ArgumentsSectionProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Add New Argument */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">📝 Ajouter un Argument</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
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
        onUpdateArgumentNote={onUpdateArgumentNote}
        onUpdateArgumentText={(_id, _text) => {}}
      />
    </div>
  )
})
