# Plan de route numéroté – Refactorisation priorisée (séquentielle)

Suivre strictement l’ordre des phases ci-dessous. Ne pas entamer une phase tant que les critères de la phase précédente ne sont pas validés. Les sous-tâches marquées (P) peuvent être réalisées en parallèle au sein de la même phase.

*   [ ] 0. Préparation
- Doc: [[architecture-et-conventions]]
- Actions:
  - Baseline qualité: exécuter lint (Biome) et typecheck (tsc), corriger erreurs bloquantes.
  - Noter l’état de référence (captures/notes) pour un smoke test rapide.
- Critères: lint/typecheck PASS; app démarre; smoke test de base OK.

*   [ ] 1. Fondations rapides (faible risque, fort levier)
- Doc: [[architecture-et-conventions]], [[utils-decision-styles-refactor]], [[lib-actions-refactor]]
- Actions:
  - Remplacer les helpers locaux par `utils/decision-styles.ts` (scan composants; corriger contrastes si besoin).
  - (P) Extraire/partager `RatingSlider` (Radix) et l’utiliser partout il est requis.
  - Ajouter schémas zod (Argument, Suggestion, Decision) dans `features/decision/schemas/`.
- Fichiers: `utils/decision-styles.ts`, `app/decision/rating-slider.tsx` (à déplacer), `lib/validation.ts` (transition), nouveaux schemas.
- Critères: build OK; styles inchangés; RatingSlider partagé; schemas présents.

*   [ ] 2. Nettoyage duplications – ArgumentsSection
- Doc: [[architecture-et-conventions]], [[duplication-cleanup]]
- Actions: Conserver une seule version sous `features/decision/components/ArgumentsSection.tsx`; mettre à jour imports; supprimer doublon.
- Fichiers: `components/decision/arguments-section.tsx`, `app/decision/arguments-section.tsx`.
- Critères: une seule source; pages fonctionnelles; lint OK.

*   [ ] 3. Découpage ArgumentsSection en sous-composants
- Doc: [[architecture-et-conventions]], [[arguments-section-refactor]], [[api-suggest-arguments-refactor]]
- Actions: Créer `NewArgumentForm`, `ArgumentList`, `EditableArgumentItem`, `AISuggestionsPanel`; transformer `ArgumentsSection` en orchestrateur.
- Fichiers: `features/decision/components/*` (nouveaux), remplacement usages.
- Critères: UI identique; SRP respecté; pas de toasts/validation dans l’UI.

*   [ ] 4. Hook use-arguments – simplification
- Doc: [[architecture-et-conventions]], [[hooks-use-arguments-refactor]]
- Actions: uuid pour ids, dérivés via `useMemo`, pas de tri mutateur permanent; API minimale.
- Fichiers: `hooks/use-arguments.ts`.
- Critères: tests unitaires basiques verts; comportement UI inchangé.

*   [ ] 5. Hook use-decision → services + hooks fins
- Doc: [[architecture-et-conventions]],  [[hooks-use-decision-refactor]]
- Actions: Créer services Supabase et IA; scinder en `useDecisionState`, `useDecisionHistory`, `useSuggestions`; retours typés; toasts déportés en conteneurs.
- Fichiers: `hooks/use-decision.ts`, `features/decision/services/*.ts` (nouveaux).
- Critères: build OK; interfaces claires; tests avec mocks services.

*   [ ] 6. API IA – zod + parsing robuste (ou Server Action)
- Doc: [[architecture-et-conventions]],  [[schemas-and-validation]], [[api-suggest-arguments-refactor]]
- Actions: Valider I/O (zod), préférer format JSON strict; option: migrer vers `actions/decision.actions.ts`.
- Fichiers: `app/api/suggest-arguments/route.ts`, schemas; éventuellement `actions/decision.actions.ts`.
- Critères: gestion d’erreurs propre; tests (format invalide/partiel) verts.

*   [ ] 7. Composants décision (header, history, results, chart)
- Doc: [[architecture-et-conventions]], [[decision-header-refactor]], [[decision-history-refactor]], [[results-section-refactor]], [[decision-chart-refactor]]
- Actions:
  - Header: props claires, a11y (aria-describedby), validation en amont.
  - History: extraire utilitaires (scores, dates, reco), sémantique liste/a11y.
  - Results: sortir ratio/reco vers `utils/decision.ts`.
  - Chart: angle/reco en utilitaires, a11y SVG renforcée.
- Fichiers: `components/decision/*.tsx`, `components/decision-chart.tsx`, `utils/decision.ts` (nouveau).
- Critères: composants déterministes; a11y validée; tests de calculs.

*   [ ] 8. Sidebar & UnifiedHeader
- Doc: [[architecture-et-conventions]], [[sidebar-module-refactor]], [[unified-header-refactor]]
- Actions: Vérifier état partagé (Zustand si nécessaire), a11y (aria-expanded, focus trap si drawer), props normalisées.
- Fichiers: `components/sidebar/*`, `components/shared/unified-header.tsx`.
- Critères: navigation clavier complète; pas de régression visuelle.

*   [ ] 9. Server Actions persistance (CRUD décision)
- Doc: [[architecture-et-conventions]]
- Actions: Créer `actions/decision.actions.ts` (create/update/delete) avec zod; adapter hooks/services.
- Fichiers: `actions/decision.actions.ts`, services décision.
- Critères: CRUD stable; erreurs normalisées; smoke test sauvegarde/chargement OK.

*   [ ] 10. Tests & outillage
- Doc: [[architecture-et-conventions]]
- Actions: Installer Vitest + Testing Library + axe; ajouter suites minimum pour composants et utilitaires; scripts npm.
- Critères: tests verts localement; rapport clair.

*   [ ] 11. Storybook (optionnel recommandé)
- Actions: Stories pour `NewArgumentForm`, `ArgumentList`, `AISuggestionsPanel`, `RatingSlider`, `DecisionChart`.
- Critères: stories fonctionnelles; docs de props.

*   [ ] 12. Nettoyage final
- Actions: supprimer code mort/doublons; exécuter Biome + typecheck; smoke test manuel final.
- Critères: lint/typecheck PASS; build PASS; UI OK.

Qualité (gates) à chaque phase
- Lint/format (Biome check --write)
- Typecheck (npx tsc --noEmit)
- Tests ciblés (quand dispo)
- Smoke test UI (navigation, ajout/suppression d’arguments, suggestions IA)
