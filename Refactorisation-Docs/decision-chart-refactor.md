# Refactor – DecisionChart

Problèmes:
- Composant client, calcule angle/aide visuelle dans l’UI; pas de props d’accessibilité (title/desc OK mais perfectible).

Objectifs:
- Déplacer les calculs dans des utilitaires, ajouter props d’a11y, réduire l’empreinte client.

Actions:
- Extraire `computeNeedleAngle(positive, negative)` et `getRecommendationByScores(positive, negative)` dans `utils/decision.ts`.
- Rendre le composant déterministe avec props dérivées (angle, labels) si besoin.
- Ajouter `aria-labelledby`/`aria-describedby` ou `role="img"` avec `<title>` et `<desc>` dynamiques.
- Tests: limites (scores nuls, très grands), snapshots contrôlés, a11y axe sur rendu.

Résultats:
- Composant plus simple, testable, accessible.
