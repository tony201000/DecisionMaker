"use client"

import type { User } from "@supabase/supabase-js"
import { Clock, FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CounterDisplay } from "@/components/ui/counter-display"
import { DateDisplay } from "@/components/ui/date-display"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { RecommendationBadge } from "@/components/ui/recommendation-badge"
import { getRecommendation, getRecommendationLabel } from "@/lib/services/recommendation-service"
import type { Argument } from "@/types/decision"

interface SavedDecision {
  id: string
  title: string
  description: string
  created_at: string
  arguments: Array<{
    text: string
    note: number
  }>
}

interface DecisionHistoryProps {
  user: User | null
  savedDecisions: SavedDecision[]
  loadingHistory: boolean
  onLoadDecisionHistory: (user: User | null) => void
  onLoadDecision: (decision: SavedDecision, setArgs: (args: Argument[]) => void) => void
  onCreateNew: (clearArgs: () => void) => void
  setArgs: (args: Argument[]) => void
  clearArgs: () => void
}

export function DecisionHistory({
  user,
  savedDecisions,
  loadingHistory,
  onLoadDecisionHistory,
  onLoadDecision,
  onCreateNew,
  setArgs,
  clearArgs
}: DecisionHistoryProps) {
  const getScores = (args: Array<{ note: number }>) => {
    const positive = args.filter(arg => arg.note > 0).reduce((sum, arg) => sum + arg.note, 0)
    const negative = Math.abs(args.filter(arg => arg.note < 0).reduce((sum, arg) => sum + arg.note, 0))
    return { negative, positive }
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Historique des décisions
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateNew(clearArgs)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle
            </Button>
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLoadDecisionHistory(user)}
                disabled={loadingHistory}
              >
                {loadingHistory ? (
                  <LoadingSpinner
                    isLoading={loadingHistory}
                    message="Chargement..."
                  />
                ) : (
                  "Actualiser"
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!user ? (
          <p className="text-muted-foreground text-center py-4">Connectez-vous pour voir votre historique</p>
        ) : loadingHistory ? (
          <LoadingSpinner
            isLoading={loadingHistory}
            message="Chargement de l'historique..."
            className="py-4"
          />
        ) : savedDecisions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Aucune décision sauvegardée</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {savedDecisions.map(decision => {
              const { positive, negative } = getScores(decision.arguments)
              const recommendation = getRecommendation(positive, negative)
              const recommendationLabel = getRecommendationLabel(recommendation)

              return (
                <button
                  key={decision.id}
                  type="button"
                  className="w-full text-left p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors focus:outline-none"
                  onClick={() => onLoadDecision(decision, setArgs)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      onLoadDecision(decision, setArgs)
                    }
                  }}
                  tabIndex={0}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{decision.title}</h4>
                      {decision.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{decision.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <FileText className="w-3 h-3 mr-1" />
                          <CounterDisplay
                            count={decision.arguments.length}
                            label="argument"
                          />
                        </div>
                        <RecommendationBadge recommendation={recommendationLabel} />
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      <DateDisplay
                        date={decision.created_at}
                        className="text-xs"
                      />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
