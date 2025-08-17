# Architecture et conventions

## Objectifs clés

- Découpler l’UI de la logique métier et des I/O (SRP). 
- Centraliser styles et utilitaires pour éviter la duplication. 
- Renforcer l’accessibilité (WAI-ARIA, navigation clavier). 
- Standardiser la validation (Zod) et la gestion d’erreurs. 
- Améliorer la testabilité (Vitest + Testing Library + axe). 
- Simplifier le data flow (hooks/services dédiés, Server Actions). 

## Arborescence (feature-first)

- features/
  - decision/
    - components/
    - hooks/
    - services/
    - schemas/
- components/
  - auth/
  - landing/
  - shared/
  - ui/ (shadcn/ui & Radix-ui)
- utils/
- types/
- actions/ (Server Actions)

## Conventions

- Next.js 15+ & React 19+ App Router
- Fichiers: kebab-case; Composants: PascalCase.
- Server Components par défaut; `"use client"` seulement si nécessaire.
- État : local minimal, global uniquement si nécessaire
- Composant découplé réutilisables, sans logique métier embarquée (<100/130 lignes)
- UI pure: aucune validation, aucun toast, pas d’I/O.
- Props : claires, typées, valeurs par défaut si besoin
- Logique métier: hooks/services (`features/.../hooks`, `features/.../services`) + Server Actions.
- Validation: zod dans `features/.../schemas`, pas de données brutes
- Supabase types généré dans types/Supabase/database.ts
- Performance : memoisation, lazy loading, streaming, PPR
- Accessibilité A11y: Radix primitives + shadcn/ui, labels/aria, focus visible, contrastes, navigation clavier
- Design System : cohérence UI/UX, respect des tokens, pas de style inline arbitraire
- Styles: tokens Tailwind, utilitaires partagés (`utils/decision-styles.ts`).

## Erreurs & toasts

- Catch explicites dans services/actions; retourner des résultats typés.
- Les toasts sont déclenchés dans les conteneurs (pages/feature), pas dans l’UI.

## Tests

- Vitest + Testing Library + axe sur composants critiques.
- Lint/format via Biome après chaque modif.
