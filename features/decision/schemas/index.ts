import * as z from "zod"

// Schéma pour un argument
export const ArgumentSchema = z.object({
  createdAt: z.date().optional(),
  id: z.uuid(),
  text: z.string().min(1, "L'argument ne peut pas être vide").max(500, "L'argument ne peut pas dépasser 500 caractères"),
  updatedAt: z.date().optional(),
  weight: z.int().min(-10).max(10)
})

// Schéma pour une suggestion IA
export const SuggestionSchema = z.object({
  category: z.enum(["positive", "negative", "neutral"]).optional(),
  reasoning: z.string().optional(),
  text: z.string().min(1, "La suggestion ne peut pas être vide").max(500, "La suggestion ne peut pas dépasser 500 caractères"),
  weight: z.int().min(-10).max(10)
})

// Schéma pour une décision
export const DecisionSchema = z.object({
  arguments: z.array(ArgumentSchema),
  createdAt: z.date(),
  description: z.string().max(1000, "La description ne peut pas dépasser 1000 caractères").optional(),
  id: z.uuid(),
  negativeScore: z.int().min(0),
  positiveScore: z.int().min(0),
  recommendation: z.enum(["favorable", "defavorable", "incertain"]),
  title: z.string().min(1, "Le titre est requis").max(100, "Le titre ne peut pas dépasser 100 caractères"),
  updatedAt: z.date()
})

// Types dérivés
export type Argument = z.infer<typeof ArgumentSchema>
export type Suggestion = z.infer<typeof SuggestionSchema>
export type Decision = z.infer<typeof DecisionSchema>

// Schémas pour la validation des entrées
export const NewArgumentSchema = z.object({
  text: z.string().min(1, "L'argument ne peut pas être vide").max(500, "L'argument ne peut pas dépasser 500 caractères"),
  weight: z.int().min(-10).max(10)
})

export const NewDecisionSchema = z.object({
  description: z.string().max(1000, "La description ne peut pas dépasser 1000 caractères").optional(),
  title: z.string().min(1, "Le titre est requis").max(100, "Le titre ne peut pas dépasser 100 caractères")
})

// Schémas pour les API
export const AISuggestionsRequestSchema = z.object({
  description: z.string().max(1000).optional(),
  title: z.string().min(1, "Le titre est requis").max(100)
})

export const AISuggestionsResponseSchema = z.object({
  suggestions: z.array(SuggestionSchema)
})
