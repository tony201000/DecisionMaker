# Refactor – API /suggest-arguments

Problèmes:
- Prompt inline, parsing JSON fragile via regex, pas de validation des sorties.

Objectifs:
- Validation zod stricte en entrée/sortie; parsing robuste; erreurs propres.

Actions:
- Créer `SuggestionSchema` & `SuggestionListSchema` (zod) dans `features/decision/schemas/`.
- Remplacer l’extraction regex par une réponse en `response_format: "json"` si support, ou parser via bloc JSON bien délimité; fallback try/catch + message utile.
- Retourner `NextResponse` typé avec `success: true/false`, `data` ou `error` clair.
- Option: migrer vers Server Action `actions/decision.actions.ts`.
- Tests: format invalide, vide, partiel; mapping/normalisation catégories.

Résultats:
- Endpoint fiable, outputs sûrs et validés.
