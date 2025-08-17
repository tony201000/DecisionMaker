"use client"

import type { User } from "@supabase/supabase-js"
import { WithSidebar } from "@/components/with-sidebar"
import { SidebarContent } from "@/components/sidebar-content"
import { DecisionHeader } from "@/components/decision/decision-header"
import { DecisionResult } from "@/components/decision-result"
import { DecisionChart } from "@/components/decision-chart"
import { useCurrentDecision } from "@/hooks/use-current-decision"
import { useArguments } from "@/hooks/use-arguments"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface DecisionPlatformProps {
  user: User
}

export function DecisionPlatform({ user }: DecisionPlatformProps) {
  const { currentDecision, createNewDecision, isLoading } = useCurrentDecision()
  const { 
    args,
    addArgument,
    removeArgument,
    updateArgumentWeight,
    positiveScore,
    negativeScore
  } = useArguments(currentDecision?.arguments || [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner isLoading={true} message="Chargement de la décision..." />
      </div>
    )
  }

  return (
    <WithSidebar
      sidebarContent={<SidebarContent />}
    >
      <div className="flex flex-col h-full bg-background">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Section */}
          {currentDecision && (
            <DecisionHeader
              currentDecision={currentDecision}
              onTitleChange={(title) => console.log('Title changed:', title)}
              onDescriptionChange={(description) => console.log('Description changed:', description)}
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
                  <p className="text-muted-foreground">
                    Interface des arguments en cours de développement...
                  </p>
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
                    decisionTitle={currentDecision?.title || "Ma décision"}
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
