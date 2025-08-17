# Refactor – components/shared/unified-header.tsx

Problèmes:
- Potentiel mélange de navigation, actions utilisateur, thème, etc. (à confirmer).

Objectifs:
- Composant présentational, sous-composants pour actions (auth/logout), thème, navigation.

Actions:
- Extraire les parties interactives dans des composants dédiés si besoin.
- A11y: `nav` sémantique, repères de page (`aria-current`), focus visibles.
- Vérifier performances (memoization si listes, `useCallback` pour handlers passés en props).
- Tests: rendu avec/ss user, navigation clavier.

Résultats:
- En-tête cohérent avec le design system et accessible.
