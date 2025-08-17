# Refactor – ResultsSection

Problèmes:
- Couplage direct à `DecisionChart` et logique de ratio dans l’UI.

Objectifs:
- UI légère, logique calcul extraite pour testabilité et réutilisation.

Actions:
- Extraire calculs: `computeRatio(positive, negative)` et `getRecommendation(ratio)` dans `utils/decision.ts`.
- Garder `ResultsSection` comme conteneur d’affichage simple; `DecisionChart` reçoit des props calculées.
- A11y: titres, descriptions, aria-live pour recommandations si dynamique.
- Tests: ratio ∞ lorsque négatif=0, formats, affichage messages “Aucune donnée”.

Résultats:
- UI stable, calculs testés indépendamment.
