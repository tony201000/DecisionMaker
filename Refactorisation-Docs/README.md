# Refactorisation globale – Vision et feuille de route

Ce dossier regroupe le plan de refactorisation pour aligner le codebase avec des pratiques modernes (React/Next.js, Radix/shadcn/ui, Zod, Server Actions) et les conventions internes du projet.

## Objectifs clés

- Découpler l’UI de la logique métier et des I/O (SRP). 
- Centraliser styles et utilitaires pour éviter la duplication. 
- Renforcer l’accessibilité (WAI-ARIA, navigation clavier). 
- Standardiser la validation (Zod) et la gestion d’erreurs. 
- Améliorer la testabilité (Vitest + Testing Library + axe). 
- Simplifier le data flow (hooks/services dédiés, Server Actions). 

## Contexte (résumé)

- Duplication de composants et responsabilités trop larges (ex: `ArgumentsSection`).
- Styles utilitaires parfois locaux alors que `utils/decision-styles.ts` existe déjà.
- Logique toasts/validation présente dans des composants de présentation.
- Suggestions IA via route API (`/api/suggest-arguments`) et logique mêlée aux composants.

## Principes de refactor

- Server Components par défaut. ‘use client’ uniquement si nécessaire. 
- Composants UI purs et petits (<100 lignes si possible). 
- Logique métier côté hooks/services (`features/.../hooks`, `features/.../services`). 
- Validation zod dans `features/.../schemas`, jamais implicite. 
- Accessibilité: Radix primitives + shadcn/ui, labels/aria corrects. 
- Erreurs explicites, toasts seulement dans le conteneur page/feature. 

## Feuille de route (PRs incrémentales)

1) Centralisation styles & composants partagés
- Unifier l’usage de `utils/decision-styles.ts` (supprimer duplications locales). 
- Extraire/partager `RatingSlider` (Radix/accessible). 

2) Découpage d’ArgumentsSection
- Créer `NewArgumentForm`, `ArgumentList`, `EditableArgumentItem`, `AISuggestionsPanel`. 
- Réduire `ArgumentsSection` à un orchestrateur. 

3) Validation & erreurs
- Ajouter `decision.schema.ts` (zod). 
- Remonter la validation/toasts dans le conteneur (hook/page). 

4) Données & services
- Extraire Supabase vers `features/decision/services/decision.service.ts`. 
- Option: migrer `/api/suggest-arguments` → Server Actions. 

5) Nettoyage & cohérence
- Supprimer la duplication `app/decision/arguments-section.tsx` vs `components/...`. 
- Mettre à jour imports vers `features/decision/components/...`. 

6) Tests & a11y
- Vitest + Testing Library + axe sur les composants critiques. 
- Vérifier focus visibles, roles, navigation clavier. 

## Quick wins

- Remplacer les helpers locaux par `utils/decision-styles`. 
- Réutiliser un `RatingSlider` commun. 
- Élaguer les responsabilités de `ArgumentsSection` immédiatement. 

---

Références internes: `.github/instructions/react-rules.instructions.md`, `lib/validation.ts`, `utils/decision-styles.ts`.
