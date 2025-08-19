"use client"

import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import { WithSidebar } from "@/components/layout/with-sidebar"
import { SidebarContent } from "@/components/sidebar/sidebar-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArgumentsSection } from "@/features/decision/components/ArgumentsSection"
import { DecisionChart } from "@/features/decision/components/DecisionChart"
import { DecisionResult } from "@/features/decision/components/DecisionResult"
import { DecisionHeader } from "@/features/decision/decision-header"
import { NewDecisionSchema } from "@/features/decision/schemas"
import { useGenerateSuggestions } from "@/hooks/use-ai-suggestions"
import { useAutoSave } from "@/hooks/use-auto-save"
import { useArguments, useCurrentDecision } from "@/hooks/use-current-decision"
import type { Argument } from "@/types/decision"

interface DecisionPlatformProps {
  user: User
}

export function DecisionPlatform({ user }: DecisionPlatformProps) {
  // ✅ API ZUSTAND PURE
  const { draftDecision, updateDraftField } = useCurrentDecision()
  const { args, positiveScore, negativeScore, addArgument, removeArgument, updateArgumentNote } = useArguments()

  // ✅ AI SUGGESTIONS HOOK
  const { generateSuggestions } = useGenerateSuggestions()

  // ✅ AUTO-SAVE HOOK
  const { isSaving } = useAutoSave({
    arguments: args,
    draftDecision,
    enabled: true,
    user
  })

  // ✅ NEW ARGUMENT FORM STATE - Centré sur 0 au lieu de 5
  const [newArgument, setNewArgument] = useState({ note: 0, text: "" })

  // ✅ VALIDATION ZOD - Remplace les console.log placeholders
  const handleTitleChange = (title: string) => {
    const result = NewDecisionSchema.shape.title.safeParse(title)
    if (result.success) {
      updateDraftField("title", result.data)
    } else {
      // TODO: Afficher les erreurs dans l'UI (prochaine itération)
      console.warn("Title validation error:", result.error.issues)
    }
  }

  const handleDescriptionChange = (description: string) => {
    const result = NewDecisionSchema.shape.description.safeParse(description)
    if (result.success) {
      updateDraftField("description", result.data)
    } else {
      // TODO: Afficher les erreurs dans l'UI (prochaine itération)
      console.warn("Description validation error:", result.error.issues)
    }
  }

  // ✅ ARGUMENT HANDLERS
  const handleAddArgument = () => {
    if (newArgument.text.trim()) {
      const argument: Argument = {
        id: Date.now().toString(),
        note: newArgument.note,
        text: newArgument.text.trim()
      }
      addArgument(argument)
      setNewArgument({ note: 0, text: "" })
    }
  }

  const handleGenerateSuggestions = async () => {
    if (draftDecision?.title) {
      await generateSuggestions(
        {
          description: draftDecision.description || "",
          title: draftDecision.title
        },
        args
      )
    }
  }

  // Loading géré par le store UI à l'avenir
  const isLoading = false

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner
          isLoading={true}
          message="Chargement de la décision..."
        />
      </div>
    )
  }

  return (
    <WithSidebar sidebarContent={<SidebarContent />}>
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header Section */}
          <DecisionHeader
            currentDecision={draftDecision || { description: "", title: "" }}
            onTitleChange={handleTitleChange}
            onDescriptionChange={handleDescriptionChange}
            user={user}
            isSaving={isSaving}
          />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {/* Arguments Section */}
            <div className="space-y-4 md:space-y-6 order-1">
              <ArgumentsSection
                newArgument={newArgument}
                setNewArgument={setNewArgument}
                onAddArgument={handleAddArgument}
                sortedArguments={args}
                onRemoveArgument={removeArgument}
                onUpdateArgumentNote={updateArgumentNote}
                decisionTitle={draftDecision?.title || ""}
                onGenerateSuggestions={handleGenerateSuggestions}
              />
            </div>

            {/* Results Section */}
            <div className="space-y-4 md:space-y-6 order-2 xl:order-2">
              {args.length > 0 ? (
                <>
                  <DecisionChart
                    positiveScore={positiveScore}
                    negativeScore={negativeScore}
                  />
                  <DecisionResult
                    positiveScore={positiveScore}
                    negativeScore={negativeScore}
                    decisionTitle={draftDecision?.title || "Ma décision"}
                  />
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Analysez votre décision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Ajoutez des arguments pour et contre pour voir l'analyse de votre décision apparaître ici.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </WithSidebar>
  )
}
