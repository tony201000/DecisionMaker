# Nettoyage des duplications – ArgumentsSection

Deux implémentations existent:
- `components/decision/arguments-section.tsx` (monolithique mais riche)
- `app/decision/arguments-section.tsx` (plus modulaire, styles centralisés)

Objectif: conserver une seule version dans `features/decision/components/ArgumentsSection.tsx`.

Étapes:
1. Déplacer la version modulaire sous `features/decision/components/ArgumentsSection.tsx` et l’aligner avec les sous-composants extraits (NewArgumentForm, ArgumentList, AISuggestionsPanel, RatingSlider partagé).
2. Mettre à jour toutes les importations des pages/containers.
3. Supprimer la version dupliquée restante.
4. Passer les helpers de styles par `utils/decision-styles` uniquement.

Vérifs:
- Build passe sans import cassé.
- UI et interactions inchangées (smoke test).
