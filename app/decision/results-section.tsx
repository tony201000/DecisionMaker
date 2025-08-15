"use client";

import { DecisionChart } from "@/components/decision-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsSectionProps {
	positiveScore: number;
	negativeScore: number;
	argumentsCount: number;
}

export function ResultsSection({
	positiveScore,
	negativeScore,
	argumentsCount,
}: ResultsSectionProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Graphique */}
			<DecisionChart
				positiveScore={positiveScore}
				negativeScore={negativeScore}
			/>

			{/* Résumé des résultats */}
			<Card>
				<CardHeader className="pb-4">
					<CardTitle className="flex items-center gap-2 text-lg">
						🎯 Résultat de l'Analyse
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Basé sur la méthode de Seymour Schulich (ratio 2:1 requis)
					</p>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-3 gap-4 text-center">
						<div>
							<div className="text-sm text-muted-foreground">Score Positif</div>
							<div className="text-2xl font-bold text-green-600">
								{positiveScore}
							</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">Score Négatif</div>
							<div className="text-2xl font-bold text-red-600">
								{negativeScore}
							</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">Ratio</div>
							<div className="text-lg font-bold text-foreground">
								{positiveScore}:{negativeScore}
							</div>
						</div>
					</div>

					{argumentsCount === 0 ? (
						<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
							<div className="text-yellow-800 dark:text-yellow-200 font-medium">
								Aucune donnée
							</div>
							<div className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
								Ajoutez des arguments pour obtenir une recommandation
							</div>
							<div className="text-yellow-600 dark:text-yellow-300 text-sm mt-2">
								Analysez votre situation
							</div>
						</div>
					) : (
						<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
							<div className="text-blue-800 dark:text-blue-200 text-sm">
								Règle 2:1 de Schulich : Une décision est favorable si les
								arguments positifs sont au moins 2 fois supérieurs aux négatifs
							</div>
							{positiveScore >= negativeScore * 2 ? (
								<div className="text-green-700 dark:text-green-300 font-medium mt-2">
									✅ Décision recommandée
								</div>
							) : negativeScore > positiveScore ? (
								<div className="text-red-700 dark:text-red-300 font-medium mt-2">
									❌ Décision non recommandée
								</div>
							) : (
								<div className="text-orange-700 dark:text-orange-300 font-medium mt-2">
									⚠️ Décision incertaine
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
