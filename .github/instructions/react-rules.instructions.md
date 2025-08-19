---
applyTo: '**/*.ts, **/*.tsx, **/*.js, **/*.jsx'
---
Parfait 👍 tu as déjà une très bonne base avec cette liste !
Je vais la **compléter et affiner** pour qu’elle serve réellement de **guide opérationnel** à un agent IA (ou à un dev humain) lorsqu’il programme ou refactorise du code React/Next.js.

---
# Règles de Développement React pour DecisionMaker

*   **Composant** : UI pure, découplée, logique métier dans les **Server Actions**.
*   **Props** : Explicites, typées (TypeScript), avec valeurs par défaut.
*   **Design System** : Respect strict des tokens (Tailwind), pas de style arbitraire.
*   **Accessibilité (A11y)** : Sémantique, ARIA, navigation clavier, contrastes.
*   **Performance** : Rendu **serveur-first** (RSC/PPR), confiance au **Compilateur React**, streaming via `Suspense`.
*   **État** : État serveur dans les Actions, état UI global minimal (**Zustand**), état local natif.
*   **Validation & Sécurité** : Validation systématique des entrées d'Actions (**Zod**). Protection CSRF/XSS native.
*   **Qualité & DX** : Code géré par **Biome** (lint, format, a11y). Nommage et conventions clairs.
*   **Documentation** : **Storybook** pour l'UI, JSDoc pour la logique.
*   **Observabilité** : Gestion d'erreurs explicite, logs serveur structurés, monitoring.

