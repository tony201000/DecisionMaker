# Refactor – hooks/use-arguments.ts

Problèmes:
- Gestion de l’état + tri + dérivés dans un seul hook; pas de validation; ids basés sur le texte.

Objectifs:
- État clair et pur, dérivés mémoïsés, ids robustes, validation externe (zod) au point d’entrée.

Actions:
- Remplacer l’id par un uuid (`crypto.randomUUID()` si dispo). 
- Exposer des sélecteurs/dérivés via `useMemo` (positiveScore, negativeScore, sortedArguments).
- Ne pas trier mutuellement à chaque update; trier à l’affichage (ou via sélecteur).
- Laisser la validation au parent; accepter un callback `onInvalid?(errors)` si besoin.
- Tests: ajout/suppression/mise à jour poids; ordre et calculs.

Résultats:
- Hook léger, prévisible, testable.
