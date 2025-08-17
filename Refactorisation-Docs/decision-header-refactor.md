# Refactor – DecisionHeader

Problèmes:
- Composant client avec logique de saisie et UI mélangées; pas de validation; `saving` non utilisé.
- Pas d’a11y avancée (aria-describedby pour erreurs/conseils).

Objectifs:
- UI pure, contrôle par props, validation gérée au parent (hook/service + zod).
- Accessibilité renforcée; supprimer toute logique non-UI.

Actions:
- Rendre le composant Server par défaut si possible; sinon Client minimal.
- Props explicites: currentDecision, errors: {title?: string[], description?: string[]}, onTitleChange, onDescriptionChange, onCreateNew.
- Ajouter `aria-invalid`, `aria-describedby` si erreurs; ids stables.
- Supprimer commentaire/props inutilisées; retirer `saving` si non utilisé.
- Écrire tests: saisie titre/description, a11y (axe), affichage auto-save hint conditionnel.

Résultats:
- Composant découplé, testable, accessible.
