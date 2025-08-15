"use client";

import type { User } from "@supabase/supabase-js";
import { FolderOpen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Decision } from "@/types/decision";

interface DecisionHeaderProps {
	currentDecision: Decision;
	setCurrentDecision: React.Dispatch<React.SetStateAction<Decision>>;
	user: User | null;
	saving: boolean;
	onSave: () => void;
}

export function DecisionHeader({
	currentDecision,
	setCurrentDecision,
	user,
	saving,
	onSave,
}: DecisionHeaderProps) {
	return (
		<Card className="border-2 border-primary/20">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-xl">
					🎯 Définissez votre décision
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Commencez par décrire clairement la décision que vous devez prendre
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="decision-title" className="text-sm font-medium">
						Titre de la décision *
					</Label>
					<Input
						id="decision-title"
						value={currentDecision.title}
						onChange={(e) =>
							setCurrentDecision((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
						placeholder="Ex: Changer d'emploi, Acheter une maison, Déménager à l'étranger..."
						className="text-lg font-medium"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="decision-description" className="text-sm font-medium">
						Description du contexte
					</Label>
					<Textarea
						id="decision-description"
						value={currentDecision.description || ""}
						onChange={(e) =>
							setCurrentDecision((prev) => ({
								...prev,
								description: e.target.value,
							}))
						}
						placeholder="Décrivez le contexte, les enjeux, les contraintes, ou toute information importante pour cette décision..."
						className="min-h-[100px] resize-none"
					/>
				</div>

				{user && (
					<div className="flex gap-2 pt-2">
						<Button
							onClick={onSave}
							disabled={saving || !currentDecision.title.trim()}
							className="bg-green-600 hover:bg-green-700 text-white"
						>
							<Save className="w-4 h-4 mr-2" />
							{saving ? "Sauvegarde..." : "Sauvegarder"}
						</Button>
						<Button variant="outline">
							<FolderOpen className="w-4 h-4 mr-2" />
							Mes décisions
						</Button>
					</div>
				)}

				{!user && (
					<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
						<p className="text-sm text-blue-800 dark:text-blue-200">
							💡 Connectez-vous pour sauvegarder vos décisions et les retrouver
							plus tard
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
