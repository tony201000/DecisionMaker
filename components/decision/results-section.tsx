import { DecisionChart } from "@/components/decision-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResultsSectionProps {
  positiveScore: number
  negativeScore: number
  argumentsCount: number
}

export function ResultsSection({ positiveScore, negativeScore, argumentsCount }: ResultsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DecisionChart
        positiveScore={positiveScore}
        negativeScore={negativeScore}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🎯 Résultat de l'Analyse</CardTitle>
          <p className="text-sm text-muted-foreground">Basé sur la méthode de Seymour Schulich (ratio 2:1 requis)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Score Positif</div>
              <div className="text-2xl font-bold text-green-600">{positiveScore}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Score Négatif</div>
              <div className="text-2xl font-bold text-red-600">{negativeScore}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Ratio</div>
              <div className="text-2xl font-bold">
                {negativeScore === 0 ? "∞" : (positiveScore / negativeScore).toFixed(1)}
                :1
              </div>
            </div>
          </div>

          {argumentsCount === 0 ? (
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-lg font-semibold text-muted-foreground mb-2">Aucune donnée</div>
              <p className="text-sm text-muted-foreground">Ajoutez des arguments pour obtenir une recommandation</p>
              <div className="mt-4 p-4 bg-background rounded border">
                <p className="text-sm font-medium">Analysez votre situation</p>
              </div>
            </div>
          ) : (
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">
                Règle 2:1 de Schulich : Une décision est favorable si les arguments positifs l'emportent avec un ratio d'au moins 2:1
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
