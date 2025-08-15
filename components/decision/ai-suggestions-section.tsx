"use client";

import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AISuggestion } from "@/types/decision";
import { getBadgeColor } from "@/utils/decision-styles";

interface AISuggestionsSectionProps {
	title: string;
	suggestions: AISuggestion[];
	loadingSuggestions: boolean;
	onGenerateSuggestions: () => void;
	onAddSuggestion: (suggestion: AISuggestion) => void;
}

export function AISuggestionsSection({
	title,
	suggestions,
	loadingSuggestions,
	onGenerateSuggestions,
	onAddSuggestion,
}: AISuggestionsSectionProps) {
	if (!title.trim()) return null;

	return (
		<div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
			<div className="flex items-center justify-between mb-3">
				<div>
					<h3 className="font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
						🤖 Suggestions IA
					</h3>
					<p className="text-sm text-purple-600 dark:text-purple-300">
						L'IA peut vous suggérer des arguments auxquels vous n'avez peut-être
						pas pensé
					</p>
				</div>
				<Button
					onClick={onGenerateSuggestions}
					disabled={loadingSuggestions}
					variant="outline"
					className="border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30 bg-transparent"
				>
					{loadingSuggestions ? "Génération..." : "Générer des suggestions"}
				</Button>
			</div>

			{suggestions.length > 0 && (
				<div className="space-y-3">
					<div className="text-sm font-medium text-purple-800 dark:text-purple-200">
						Suggestions générées ({suggestions.length}) :
					</div>
					<div className="grid gap-3">
						{suggestions.map((suggestion) => (
							<div
								key={suggestion.text}
								className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-purple-200 dark:border-purple-700"
							>
								<div className="flex-1 space-y-2">
									<p className="text-sm text-gray-800 dark:text-gray-200">
										{suggestion.text}
									</p>
									<div className="flex items-center gap-2">
										<Badge className={getBadgeColor(suggestion.weight)}>
											Note: {suggestion.weight}
										</Badge>
										<Badge variant="outline" className="text-xs">
											{suggestion.category}
										</Badge>
									</div>
								</div>
								<Button
									onClick={() => onAddSuggestion(suggestion)}
									size="sm"
									className="bg-purple-600 hover:bg-purple-700 text-white"
								>
									<Plus className="w-4 h-4 mr-1" />
									Ajouter
								</Button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
