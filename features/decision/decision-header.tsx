"use client"

import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Decision } from "@/types/decision"

interface DecisionHeaderProps {
  currentDecision: Partial<Decision> // ✅ ZUSTAND: Support draft decision
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  user: User | null
  isSaving?: boolean
}

export function DecisionHeader({ currentDecision, onTitleChange, onDescriptionChange, user, isSaving }: DecisionHeaderProps) {
  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">📋 Définir votre Décision</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 md:p-6">
        <div className="space-y-2">
          <Label
            htmlFor="decision-title"
            className="text-sm font-medium text-muted-foreground"
          >
            Titre de la décision *
          </Label>
          <Input
            id="decision-title"
            placeholder="Ex: Changer d'emploi, Acheter une maison..."
            value={currentDecision.title || ""}
            onChange={e => onTitleChange(e.target.value)}
            className="text-base md:text-lg font-semibold text-foreground border-2 focus:border-primary placeholder:text-foreground/70 placeholder:font-medium placeholder:italic"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="decision-description"
            className="text-sm font-medium text-muted-foreground"
          >
            Description du contexte
          </Label>
          <Textarea
            id="decision-description"
            placeholder="Décrivez le contexte de votre décision..."
            value={currentDecision.description || ""}
            onChange={e => onDescriptionChange(e.target.value)}
            rows={3}
            className="min-h-[80px] text-base font-medium text-foreground border-2 focus:border-primary resize-none placeholder:text-foreground/70 placeholder:font-medium placeholder:italic"
          />
        </div>

        {user && currentDecision.title?.trim() && (
          <div className="flex items-center text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full mr-2 ${isSaving ? "bg-blue-500 animate-pulse" : "bg-green-500"}`}></div>
            {isSaving ? "Sauvegarde en cours..." : "Sauvegarde automatique"}
          </div>
        )}

        {!user && (
          <div className="text-center p-3 md:p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Connectez-vous pour sauvegarder vos décisions</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
