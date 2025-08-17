# Refactor – hooks/use-decision.ts

Problèmes:
- Hook monolithique: Supabase (CRUD), IA, UI toasts, auto-save, historique.
- Responsabilités multiples, difficile à tester.

Objectifs:
- Séparer en services et hooks spécifiques; validation & erreurs explicites; IO côté service/Server Actions.

Actions:
- Créer services: `features/decision/services/decision.service.ts` (CRUD Supabase), `features/decision/services/suggestions.service.ts` (IA).
- Créer hooks fins: `useDecisionState` (state courant), `useDecisionHistory`, `useSuggestions`.
- Retirer `console.error` ; retourner `Result` typé (success/data/error) ; les toasts déclenchés dans les pages/containers.
- Ajouter schemas zod pour inputs/outputs (ex: SuggestionListSchema).
- Tests: mocks services; happy path + erreurs (DB down, JSON IA invalide).

Résultats:
- API claire, testable, maintenance facilitée.
