"use client"

import { Clock, FileText, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "@supabase/supabase-js"
import type { Argument } from "@/types/decision"

interface SavedDecision {
  id: string
  title: string
  description: string
  created_at: string
  arguments: Array<{
    text: string
    weight: number
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
  clearArgs,
}: DecisionHistoryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScores = (args: Array<{ weight: number }>) => {
    const positive = args.filter((arg) => arg.weight > 0).reduce((sum, arg) => sum + arg.weight, 0)
    const negative = Math.abs(args.filter((arg) => arg.weight < 0).reduce((sum, arg) => sum + arg.weight, 0))
    return { positive, negative }
  }

  const getRecommendation = (positive: number, negative: number) => {
    if (positive === 0 && negative === 0) return { text: "Aucune donnée", color: "bg-gray-100 text-gray-800" }
    const ratio = negative === 0 ? Number.POSITIVE_INFINITY : positive / negative
    if (ratio >= 2) return { text: "Favorable", color: "bg-green-100 text-green-800" }
    if (ratio <= 0.5) return { text: "Défavorable", color: "bg-red-100 text-red-800" }
    return { text: "Mitigé", color: "bg-orange-100 text-orange-800" }
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
            <Button variant="outline" size="sm" onClick={() => onCreateNew(clearArgs)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle
            </Button>
            {user && (
              <Button variant="outline" size="sm" onClick={() => onLoadDecisionHistory(user)} disabled={loadingHistory}>
                {loadingHistory ? "Chargement..." : "Actualiser"}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!user ? (
          <p className="text-muted-foreground text-center py-4">Connectez-vous pour voir votre historique</p>
        ) : loadingHistory ? (
          <p className="text-muted-foreground text-center py-4">Chargement de l'historique...</p>
        ) : savedDecisions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Aucune décision sauvegardée</p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {savedDecisions.map((decision) => {
              const { positive, negative } = getScores(decision.arguments)
              const recommendation = getRecommendation(positive, negative)

              return (
                <div
                  key={decision.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onLoadDecision(decision, setArgs)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{decision.title}</h4>
                      {decision.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{decision.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          {decision.arguments.length} arguments
                        </Badge>
                        <Badge className={`text-xs ${recommendation.color}`}>{recommendation.text}</Badge>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">{formatDate(decision.created_at)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
