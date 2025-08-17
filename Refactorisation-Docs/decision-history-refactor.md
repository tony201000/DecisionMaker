# Refactor – DecisionHistory

Problèmes:
- Mélange UI et logique (formatDate, getScores, getRecommendation) dans le composant.
- Accessibilité à améliorer (bouton-`div`, gestion clavier manuelle partielle).

Objectifs:
- UI pure; logique utilitaire extraite.
- Navigation clavier et rôles ARIA corrects; sémantique liste.

Actions:
- Extraire utilitaires: `formatDate` (lib/utils/date.ts), `getScores` (utils/decision.ts), `getRecommendation` (utils/decision.ts).
- Remplacer les `button` enveloppants par des items de liste cliquables avec `role="listitem"` et un bouton/link interne, ou conserver `button` mais structurer la liste avec `<ul>`.
- Props: decisions (typer avec `Decision` simplifié), onSelect(decision), onRefresh(), onCreateNew().
- États `loadingHistory` et `user` gérés par le container; pas de fetch dans l’UI.
- Tests: tri/affichage, a11y (axe), callbacks au clavier (Enter/Espace) et souris.

Résultats:
- Composant lisible, a11y, logique partagée et réutilisable.
