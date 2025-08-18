"use client"

import type { User } from "@supabase/supabase-js"
import { WithSidebar } from "@/components/layout/with-sidebar"
import { SidebarContent } from "@/components/sidebar/sidebar-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { DecisionChart } from "@/features/decision/components/DecisionChart"
import { DecisionResult } from "@/features/decision/components/DecisionResult"
import { DecisionHeader } from "@/features/decision/decision-header"
import { useArguments, useCurrentDecision } from "@/hooks/use-current-decision"
import { NewDecisionSchema } from "@/features/decision/schemas"

interface DecisionPlatformProps {
  user: User
}

export function DecisionPlatform({ user }: DecisionPlatformProps) {
  // ✅ API ZUSTAND PURE
  const { draftDecision, createNewDecision, updateDraftField } = useCurrentDecision()
  const { args, positiveScore, negativeScore } = useArguments()

  // ✅ VALIDATION ZOD - Remplace les console.log placeholders
  const handleTitleChange = (title: string) => {
    const result = NewDecisionSchema.shape.title.safeParse(title)
    if (result.success) {
      updateDraftField('title', result.data)
    } else {
      // TODO: Afficher les erreurs dans l'UI (prochaine itération)
      console.warn("Title validation error:", result.error.issues)
    }
  }

  const handleDescriptionChange = (description: string) => {
    const result = NewDecisionSchema.shape.description.safeParse(description)
    if (result.success) {
      updateDraftField('description', result.data)
    } else {
      // TODO: Afficher les erreurs dans l'UI (prochaine itération)  
      console.warn("Description validation error:", result.error.issues)
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Section */}
          {draftDecision && (
            <DecisionHeader
              currentDecision={draftDecision}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
              user={user}
              onCreateNew={createNewDecision}
            />
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Arguments Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Arguments Pour et Contre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Interface des arguments en cours de développement...</p>
                  <div className="mt-4">
                    <p className="text-sm">Arguments actuels : {args.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
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
