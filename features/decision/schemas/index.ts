import * as z from "zod"

// Schéma pour un argument
export const ArgumentSchema = z.object({
  createdAt: z.preprocess(val => new Date(String(val)), z.date({ error: "La date de création est invalide" })),
  id: z.uuid(),
  note: z.int().min(-10).max(10),
  text: z.string().min(1, { error: "L'argument ne peut pas être vide" }).max(500, { error: "L'argument ne peut pas dépasser 500 caractères" }),
  updatedAt: z.preprocess(val => new Date(String(val)), z.date({ error: "La date de mise à jour est invalide" }))
})

// Schéma pour une suggestion IA
export const SuggestionSchema = z.object({
  category: z.enum(["positive", "negative", "neutral"]).optional(),
  note: z.int().min(-10, { error: "La note doit être comprise entre -10 et 10" }).max(10, { error: "La note doit être comprise entre -10 et 10" }),
  reasoning: z.string().optional(),
  text: z.string().min(1, { error: "La suggestion ne peut pas être vide" }).max(500, { error: "La suggestion ne peut pas dépasser 500 caractères" })
})

// Schéma pour une décision
export const DecisionSchema = z.object({
  arguments: z.array(ArgumentSchema),
  createdAt: z.preprocess(val => new Date(String(val)), z.date({ error: "La date de création est invalide" })),
  description: z.string().max(1000, { error: "La description ne peut pas dépasser 1000 caractères" }).optional(),
  id: z.uuid({ error: "L'ID de la décision doit être un UUID" }),
  negativeScore: z.number().negative({ error: "Le score négatif doit être négatif" }),
  positiveScore: z.number().positive({ error: "Le score positif doit être positif" }),
  recommendation: z.enum(["favorable", "defavorable", "incertain"]),
  title: z.string().min(1, { error: "Le titre est requis" }).max(100, { error: "Le titre ne peut pas dépasser 100 caractères" }),
  updatedAt: z.preprocess(val => new Date(String(val)), z.date({ error: "La date de mise à jour est invalide" }))
})

// Types dérivés
export type Argument = z.infer<typeof ArgumentSchema>
export type Suggestion = z.infer<typeof SuggestionSchema>
export type Decision = z.infer<typeof DecisionSchema>

// Schémas pour la validation des entrées
export const NewArgumentSchema = z.object({
  note: z.int().min(-10, { error: "La note doit être comprise entre -10 et 10" }).max(10, { error: "La note doit être comprise entre -10 et 10" }),
  text: z.string().min(1, { error: "L'argument ne peut pas être vide" }).max(500, { error: "L'argument ne peut pas dépasser 500 caractères" })
})

export const NewDecisionSchema = z.object({
  description: z.string().max(1000, { error: "La description ne peut pas dépasser 1000 caractères" }).optional(),
  title: z.string().min(1, { error: "Le titre est requis" }).max(100, { error: "Le titre ne peut pas dépasser 100 caractères" })
})

// Schémas pour les API
export const AISuggestionsRequestSchema = z.object({
  description: z.string().max(1000, { error: "La description ne peut pas dépasser 1000 caractères" }).optional(),
  title: z.string().min(1, { error: "Le titre est requis" }).max(100, { error: "Le titre ne peut pas dépasser 100 caractères" })
})

export const AISuggestionsResponseSchema = z.object({
  suggestions: z.array(SuggestionSchema)
})

export type NewArgument = z.infer<typeof NewArgumentSchema>
export type NewDecision = z.infer<typeof NewDecisionSchema>
export type AISuggestionsRequest = z.infer<typeof AISuggestionsRequestSchema>
