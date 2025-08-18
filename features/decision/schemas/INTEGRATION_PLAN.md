# Plan d'Intégration Zod - DecisionMaker

## 📋 **SITUATION ACTUELLE (Analysée)**

### ✅ **Assets existants à conserver :**
- [`features/decision/schemas/index.ts`](features/decision/schemas/index.ts) - Schemas Zod complets mais inutilisés
- [`DecisionCrudService`](lib/services/decision-crud-service.ts) - Service fonctionnel avec validation minimale
- Interface UI fonctionnelle (composants, hooks, store)

### ❌ **Code legacy/inutile à supprimer :**
- Console.log placeholders dans [`DecisionPlatform.tsx`](features/platform/DecisionPlatform.tsx)
- Props `validationErrors: string[]` non utilisés
- Validation manuelle basique dans [`DecisionCrudService`](lib/services/decision-crud-service.ts)
- État de validation inutilisé dans [`decision-store.ts`](lib/stores/decision-store.ts)

---

## 🎯 **PLAN D'INTÉGRATION EN 4 PHASES**

### **PHASE 1 : RÉFLEXION & ANALYSE** ✅ *TERMINÉE*
- [x] Cartographie du flux actuel de validation
- [x] Identification des points d'injection Zod
- [x] Recensement du code mort/legacy

### **PHASE 2 : PLAN D'IMPLÉMENTATION** 🎯 *EN COURS*

#### **2.1 - Architecture de Validation Zod**
```typescript
// Structure cible
├── features/decision/schemas/index.ts (✅ existe, à connecter)
├── services/ (🔧 intégration Zod)
├── hooks/ (🔧 validation côté client)  
└── components/ (🔧 affichage des erreurs Zod)
```

#### **2.2 - Points d'intégration prioritaires**
1. **Validation côté Service** (Server-side)
2. **Validation côté Client** (UX immédiate) 
3. **Gestion d'erreurs unifiée**

#### **2.3 - Code à supprimer/remplacer**
1. **Props inutiles** : `validationErrors: string[]` 
2. **État Zustand legacy** : `validation: { titleError, descriptionError, generalError }`
3. **Console.log placeholders** : Dans `DecisionPlatform.tsx`
4. **Validation manuelle** : `!decision.title.trim()` → schemas Zod

### **PHASE 3 : IMPLÉMENTATION**

#### **3.1 - Service Layer (Validation server-side)**
```typescript
// Dans DecisionCrudService.ts
import { NewDecisionSchema, ArgumentSchema } from "@/features/decision/schemas"

async saveDecision(user, decision, args) {
  // ❌ SUPPRIMER : if (!decision.title.trim()) throw new Error(...)
  // ✅ AJOUTER : const validatedDecision = NewDecisionSchema.parse(decision)
  // ✅ AJOUTER : const validatedArgs = z.array(ArgumentSchema).parse(args)
}
```

#### **3.2 - Client Layer (Validation UX)**
```typescript
// Dans useNewArgumentFormZustand()
addArgument: () => {
  // ❌ SUPPRIMER : if (form.text.trim()) { ... }
  // ✅ AJOUTER : 
  const result = ArgumentSchema.safeParse({ text: form.text, weight: form.weight })
  if (result.success) { addDraftArgument(result.data) }
  else { setValidationErrors(result.error.issues) }
}
```

#### **3.3 - État & Props Cleanup**
```typescript
// ❌ SUPPRIMER de decision-store.ts :
validation: {
  titleError: string | null
  descriptionError: string | null  
  generalError: string | null
}

// ❌ SUPPRIMER des composants :
validationErrors: string[] // Props non utilisés

// ✅ AJOUTER : Gestion d'erreurs Zod native
```

#### **3.4 - Components Integration**
```tsx
// Dans DecisionPlatform.tsx
// ❌ SUPPRIMER : onTitleChange={title => console.log("Title changed:", title)}
// ✅ AJOUTER : onTitleChange={(title) => handleValidationAndUpdate('title', title)}
```

### **PHASE 4 : NETTOYAGE & TESTS**

#### **4.1 - Suppression définitive**
- [ ] Props `validationErrors: string[]` dans tous les composants
- [ ] État `validation` dans `decision-store.ts`
- [ ] Sélecteurs `useValidation()`, `setValidationError()`, `clearValidationErrors()`
- [ ] Console.log placeholders
- [ ] Validation manuelle `trim()` dans services

#### **4.2 - Tests de régression**
- [ ] Validation titre (longueur, caractères requis)
- [ ] Validation description (longueur max)
- [ ] Validation arguments (texte, poids -10/+10)
- [ ] Messages d'erreur français
- [ ] UX : erreurs affichées en temps réel

#### **4.3 - Vérification intégration**
- [ ] Aucun console.log de validation restant
- [ ] Aucun props `validationErrors` inutilisé
- [ ] Tous les schemas Zod connectés et utilisés
- [ ] Performance : pas de validation redondante

---

## 🎯 **PROCHAINES ACTIONS IMMÉDIATES**

1. **Valider ce plan** avec les exigences projet
2. **Commencer Phase 3.1** : Intégration Zod dans `DecisionCrudService` 
3. **Tests incrémentaux** après chaque point d'intégration
4. **Nettoyage progressif** du code legacy

---

## ⚠️ **POINTS D'ATTENTION**

- **Compatibilité** : Maintenir les interfaces TypeScript existantes
- **Messages d'erreur** : Conserver les textes français actuels
- **Performance** : Éviter la validation redondante côté client + server
- **UX** : Validation en temps réel sans casser l'expérience utilisateur

**Status : PRÊT POUR IMPLÉMENTATION** 🚀
