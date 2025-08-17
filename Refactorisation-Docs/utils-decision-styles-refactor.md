# Refactor – utils/decision-styles.ts

Problèmes:
- Palette et contrastes perfectibles (texte noir sur rouge foncé). Dédoublonnage partiel ailleurs.

Objectifs:
- Source unique de vérité pour styles état/poids avec contrastes AA.

Actions:
- Vérifier contrastes et ajuster `getGradient` (texte blanc pour rouges/verts foncés). 
- Documenter le mapping -10..+10 et quand utiliser badge vs border.
- Remplacer tous les helpers locaux par ces fonctions (recherches ciblées et fixes).

Résultats:
- Cohérence visuelle et accessibilité renforcée.
