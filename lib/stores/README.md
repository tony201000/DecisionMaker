# Stores Zustand - DecisionMaker

## Vue d'ensemble

Ce dossier contient les stores Zustand qui gèrent l'état global de l'application DecisionMaker. L'architecture suit le principe de séparation des responsabilités avec des stores spécialisés.

## Architecture

```
lib/stores/
├── README.md                 # Ce fichier
├── index.ts                  # Point d'entrée unifié
├── ui-store.ts              # État UI global (sidebar, theme, modals)
├── decision-store.ts        # Gestion des décisions et arguments
├── suggestions-store.ts     # Suggestions IA avec filtrage
└── auth-store.ts            # État d'authentification
```

## Stores disponibles

### 🎨 UI Store (`ui-store.ts`)
Gère l'état de l'interface utilisateur globale.

**État :**
- `sidebarOpen` - État d'ouverture de la sidebar
- `isDarkMode` - Mode sombre/clair
- `modals` - État des modals ouvertes
- `loading` - États de chargement globaux

**Persistance :** localStorage (préférences UI)

### 🎯 Decision Store (`decision-store.ts`)
Gère les décisions et arguments en cours d'édition.

**État :**
- `currentDecisionId` - ID de la décision active
- `title` - Titre de la décision
- `arguments` - Liste des arguments avec text/weight
- `newArgument` - Formulaire d'ajout d'argument

**Calculs :** Scores positifs/négatifs, tri des arguments

### 🤖 Suggestions Store (`suggestions-store.ts`)
Gère les suggestions IA avec fonctionnalités avancées.

**État :**
- `suggestions` - Liste des suggestions générées
- `loading` - État de génération
- `filters` - Filtres par type/poids
- `history` - Historique des suggestions

### 🔐 Auth Store (`auth-store.ts`)
Gère l'authentification utilisateur.

**État :**
- `user` - Données utilisateur Supabase
- `loading` - État de chargement
- `initialized` - État d'initialisation

## Hooks d'interface

Chaque store expose des hooks spécialisés dans `/hooks/` :

```typescript
// Hooks UI
import { useTheme, useSidebar, useUI } from '@/hooks/use-ui'

// Hooks décision
import { useCurrentDecision, useArguments } from '@/hooks/use-current-decision'

// Hooks suggestions
import { useAISuggestions } from '@/hooks/use-ai-suggestions'

// Hooks auth
import { useAuth } from '@/hooks/use-auth'
```

## Conventions

1. **Stores purs** : Logique métier uniquement, pas d'effets de bord
2. **Hooks d'interface** : Gèrent les effets (useEffect, API calls)
3. **Sélecteurs optimisés** : Évitent les re-renders inutiles
4. **Types stricts** : Toutes les interfaces sont typées
5. **DevTools** : Activation en mode développement

## Migration depuis useState

✅ **Terminée** - Tous les `useState` de gestion d'état global ont été migrés vers Zustand.

Les `useState` restants gèrent uniquement :
- État local de composants (formulaires, pagination)
- Providers React (Toast, React Query)
- États temporaires (édition inline)

## État serveur

**React Query** reste utilisé pour :
- Requêtes Supabase (`useDecisionHistory`, `useDecisionStats`)
- Mutations serveur (`useDeleteDecision`, `useRenameDecision`)
- Cache serveur et synchronisation

## Exemple d'utilisation

```typescript
// Composant utilisant plusieurs stores
function DecisionPage() {
  // UI
  const { isDarkMode } = useTheme()
  const { sidebarOpen } = useSidebar()
  
  // Décision
  const { 
    title, 
    newArgument, 
    setTitle, 
    setNewArgument, 
    addArgument 
  } = useCurrentDecision()
  
  // Suggestions IA
  const { 
    suggestions, 
    loading: loadingSuggestions, 
    generateSuggestions 
  } = useAISuggestions()
  
  return (
    <div className={isDarkMode ? 'dark' : ''}>
      {/* Interface utilisateur */}
    </div>
  )
}
```

## Performance

- **Sélecteurs optimisés** : Évitent les re-renders sur changements non pertinents
- **État minimal** : Chaque store ne contient que l'état nécessaire
- **Persistance sélective** : Seules les préférences UI sont persistées
- **DevTools** : Debugging facilité avec Redux DevTools

## Tests

Les stores sont testables unitairement :

```typescript
import { useUIStore } from '@/lib/stores'

test('UI store toggle theme', () => {
  const { toggleTheme, isDarkMode } = useUIStore.getState()
  
  expect(isDarkMode).toBe(false)
  toggleTheme()
  expect(useUIStore.getState().isDarkMode).toBe(true)
})
```
