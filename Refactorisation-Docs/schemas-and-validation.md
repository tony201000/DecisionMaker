# Schémas et validation (Zod)

Créer des schémas pour les objets clés et s’en servir côté serveur (Actions/Routes) et côté client (guards rapides).

- ArgumentSchema
  - text: string().min(1).max(MAX_ARGUMENT_LENGTH)
  - weight: number().int().min(-10).max(10)
- SuggestionSchema
  - text, weight, category, reasoning
- DecisionSchema
  - title: string().min(1).max(MAX_TITLE_LENGTH)
  - description?: string().max(MAX_DESCRIPTION_LENGTH)
  - arguments: ArgumentSchema[]

Intégration:
- Valider inputs des Server Actions/Routes; renvoyer erreurs normalisées.
- Option: générer types inferés (z.infer<...>) et remplacer types ad hoc.
- Ajouter tests de validation.
