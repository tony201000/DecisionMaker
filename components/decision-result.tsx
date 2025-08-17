"use client"

import { AlertTriangle, CheckCircle, Target, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RatioDisplay } from "@/components/ui/ratio-display"
import { ScoreDisplay } from "@/components/ui/score-display"

interface DecisionResultProps {
  positiveScore: number
  negativeScore: number
  decisionTitle: string
}

export function DecisionResult({ positiveScore, negativeScore, decisionTitle }: DecisionResultProps) {
  const ratio = negativeScore > 0 ? positiveScore / negativeScore : positiveScore > 0 ? Number.POSITIVE_INFINITY : 0
  const shouldProceed = ratio >= 2
  const isClose = ratio >= 1.5 && ratio < 2

  const getRecommendation = () => {
    if (positiveScore === 0 && negativeScore === 0) {
      return {
        action: "Analysez votre situation",
        color: "yellow",
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        message: "Ajoutez des arguments pour obtenir une recommandation",
        title: "Aucune donnée"
      }
    }

    if (shouldProceed) {
      return {
        action: "Vous devriez aller de l'avant",
        color: "green",
        icon: <CheckCircle className="h-6 w-6 text-green-500" />,
        message: `Les arguments positifs l'emportent largement (ratio ${ratio.toFixed(1)}:1)`,
        title: "Recommandation: PROCÉDEZ"
      }
    }

    if (isClose) {
      return {
        action: "Analysez davantage ou cherchez plus d'avantages",
        color: "yellow",
        icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
        message: `Le ratio est proche mais insuffisant (${ratio.toFixed(1)}:1). Besoin de 2:1 minimum.`,
        title: "Recommandation: RÉFLÉCHISSEZ"
      }
    }

    return {
      action: "Cette décision n'est pas recommandée",
      color: "red",
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      message: `Les inconvénients sont trop importants (ratio ${ratio.toFixed(1)}:1)`,
      title: "Recommandation: N'Y ALLEZ PAS"
    }
  }

  const recommendation = getRecommendation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Résultat de l'Analyse
        </CardTitle>
        <CardDescription>Basé sur la méthode de Seymour Schulich (ratio 2:1 requis)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Decision Title */}
        {decisionTitle && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Décision analysée:</h3>
            <p className="text-slate-700 dark:text-slate-300">{decisionTitle}</p>
          </div>
        )}

        {/* Scores Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <ScoreDisplay
            value={positiveScore}
            label="Score Positif"
            variant="positive"
          />
          <ScoreDisplay
            value={negativeScore}
            label="Score Négatif"
            variant="negative"
          />
          <RatioDisplay
            ratio={ratio}
            className="text-center"
          />
        </div>

        {/* Recommendation */}
        <div
          className={`p-6 rounded-lg border-2 ${
            recommendation.color === "green"
              ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
              : recommendation.color === "red"
                ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                : "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
          }`}
        >
          <div className="flex items-start gap-3">
            {recommendation.icon}
            <div className="flex-1">
              <h3
                className={`font-bold text-lg ${
                  recommendation.color === "green"
                    ? "text-green-800 dark:text-green-200"
                    : recommendation.color === "red"
                      ? "text-red-800 dark:text-red-200"
                      : "text-yellow-800 dark:text-yellow-200"
                }`}
              >
                {recommendation.title}
              </h3>
              <p
                className={`mt-1 ${
                  recommendation.color === "green"
                    ? "text-green-700 dark:text-green-300"
                    : recommendation.color === "red"
                      ? "text-red-700 dark:text-red-300"
                      : "text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {recommendation.message}
              </p>
              <p
                className={`mt-2 font-medium ${
                  recommendation.color === "green"
                    ? "text-green-800 dark:text-green-200"
                    : recommendation.color === "red"
                      ? "text-red-800 dark:text-red-200"
                      : "text-yellow-800 dark:text-yellow-200"
                }`}
              >
                {recommendation.action}
              </p>
            </div>
          </div>
        </div>

        {/* Methodology Reminder */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Méthode de Seymour Schulich</h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            "Si le score positif est au moins le double du score négatif, vous devriez procéder. Sinon, n'y allez pas ou réfléchissez-y à deux fois."
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
