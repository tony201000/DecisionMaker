# Refactor – Module Sidebar

Cible: `components/sidebar/*`

Problèmes:
- Multiples composants liés (provider, header, user, stats, recent, actions) – alignement des responsabilités et état global à vérifier.

Objectifs:
- État global minimal (Zustand si nécessaire), composants purs, accessibilité menu/navigation.

Actions:
- Introduire un store `useSidebarStore` si des états sont partagés (ou lever l’état au parent). 
- Vérifier a11y (aria-expanded, focus trap si modal/drawer via Radix `Dialog`/`Sheet`).
- Normaliser props (données, callbacks) et typer précisément.
- Tests: navigation clavier, raccourcis éventuels, rendu SSR safe.

Résultats:
- Sidebar modulaire, performante et accessible.
