"use client";

import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AISuggestion, Argument } from "@/types/decision";
import { getArgumentColor, getBadgeColor, getGradient } from "@/utils/decision-styles";
import { AISuggestionsSection } from "./ai-suggestions-section";
import { RatingSlider } from "./rating-slider";

interface ArgumentsSectionProps {
	newArgument: { text: string; weight: number };
	setNewArgument: React.Dispatch<React.SetStateAction<{ text: string; weight: number }>>;
	onAddArgument: () => void;
	sortedArguments: Argument[];
	onRemoveArgument: (id: string) => void;
	onUpdateArgumentWeight: (id: string, weight: number) => void;
	
	// AI Suggestions props
	decisionTitle: string;
	aiSuggestions: AISuggestion[];
	loadingSuggestions: boolean;
	onGenerateSuggestions: () => void;
	onAddSuggestion: (suggestion: AISuggestion) => void;
}

export function ArgumentsSection({
	newArgument,
	setNewArgument,
	onAddArgument,
	sortedArguments,
	onRemoveArgument,
	onUpdateArgumentWeight,
	decisionTitle,
	aiSuggestions,
	loadingSuggestions,
	onGenerateSuggestions,
	onAddSuggestion,
}: ArgumentsSectionProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					💭 Arguments
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Ajoutez vos arguments et notez-les de -10 (très négatif) à +10
					(très positif)
				</p>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* AI suggestions section */}
				<AISuggestionsSection
					title={decisionTitle}
					suggestions={aiSuggestions}
					loadingSuggestions={loadingSuggestions}
					onGenerateSuggestions={onGenerateSuggestions}
					onAddSuggestion={onAddSuggestion}
				/>

				{/* Ajouter un nouvel argument */}
				<div className="space-y-4">
					<Textarea
						placeholder="Décrivez votre argument..."
						value={newArgument.text}
						onChange={(e) =>
							setNewArgument((prev) => ({
								...prev,
								text: e.target.value,
							}))
						}
						className="min-h-[80px]"
					/>

					{/* Slider de notation */}
					<div className="space-y-3">
						<Label className="text-sm font-medium">
							Note de l'argument
						</Label>
						<RatingSlider
							value={newArgument.weight}
							onChange={(weight) =>
								setNewArgument((prev) => ({ ...prev, weight }))
							}
						/>
					</div>

					<Button
						onClick={onAddArgument}
						disabled={!newArgument.text.trim()}
						className="w-full"
					>
						<Plus className="w-4 h-4 mr-2" />
						Ajouter l'argument
					</Button>
				</div>

				{/* Liste des arguments */}
				{sortedArguments.length > 0 && (
					<div className="space-y-3">
						<h3 className="font-medium text-foreground">
							Arguments ajoutés ({sortedArguments.length})
						</h3>
						<div className="space-y-3 max-h-96 overflow-y-auto">
							{sortedArguments.map((argument) => (
								<div
									key={argument.id}
									className={`flex items-start gap-3 p-4 bg-muted/50 rounded-lg border ${getArgumentColor(argument.weight)}`}
								>
									<div className="flex-1 space-y-2">
										<p className="text-foreground">{argument.text}</p>
										<div className="flex items-center gap-2">
											<Badge className={getBadgeColor(argument.weight)}>
												Note: {argument.weight}
											</Badge>
											<div className="flex gap-1">
												{[-2, -1, 0, 1, 2].map((offset) => {
													const newWeight = argument.weight + offset;
													const isCurrentWeight = offset === 0;
													if (newWeight < -10 || newWeight > 10)
														return null;
													return (
														<Button
															key={offset}
															variant="outline"
															size="sm"
															className={`w-8 h-8 p-0 text-xs rounded-full ${getGradient(newWeight)} hover:scale-105 transition-all duration-200 ${
																isCurrentWeight
																	? "opacity-100 ring-2 ring-primary scale-110 font-bold"
																	: "opacity-70"
															}`}
															onClick={() =>
																onUpdateArgumentWeight(
																	argument.id,
																	newWeight,
																)
															}
														>
															{newWeight}
														</Button>
													);
												})}
											</div>
										</div>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={() => onRemoveArgument(argument.id)}
										className="text-destructive hover:text-destructive hover:bg-destructive/10"
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
