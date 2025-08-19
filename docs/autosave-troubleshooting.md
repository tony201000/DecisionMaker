# Guide de Dépannage Auto-Save

## 🚨 Problèmes Courants et Solutions

### 1. Auto-Save Ne Se Déclenche Plus

**Symptômes** :
- L'indicateur de sauvegarde ne s'affiche plus
- Modifications perdues au rafraîchissement

**Diagnostics** :
```javascript
// Dans la console du navigateur
console.log("Auto-save debug logs:")
// Chercher: "🔄 Auto-save effect triggered"
// Si absent → problème de déclenchement useEffect
```

**Solutions** :
1. Vérifier les dépendances du `useEffect` dans `use-auto-save.ts`
2. S'assurer que `user`, `enabled`, et `draftDecision` sont valides
3. Vérifier que `hasChanged` detecte bien les modifications

### 2. Création de Doublons

**Symptômes** :
- Plusieurs décisions avec titres similaires ou identiques
- Historique montrant des duplicatas

**Diagnostics** :
```javascript
// Vérifier l'ID de la décision courante
console.log("Current draft ID:", draftDecision.id)
// Après sauvegarde, doit être défini
```

**Solutions** :
1. Vérifier que `updateDraftField("id", newId)` est appelé après sauvegarde réussie
2. Contrôler que `existingId` est bien passé aux appels UPSERT suivants
3. Vérifier les logs SQL pour s'assurer que la recherche par ID fonctionne

### 3. Erreurs de Base de Données

**Symptômes** :
- Messages d'erreur dans les logs : "Could not find function"
- Sauvegarde échoue systématiquement

**Solutions** :
```bash
# Vérifier que la migration est appliquée
supabase db push

# Tester la fonction manuellement
supabase db reset
```

### 4. Performance Dégradée

**Symptômes** :
- Sauvegarde très lente (>5 secondes)
- Interface qui lag pendant la saisie

**Solutions** :
1. Augmenter le délai de debouncing si nécessaire
2. Vérifier les index de base de données
3. Optimiser la taille des données des arguments

## 🔍 Commandes de Debug

### Logs Frontend
```javascript
// Activer tous les logs auto-save
localStorage.setItem('debug-autosave', 'true')

// Dans use-auto-save.ts, ajouter si nécessaire:
if (localStorage.getItem('debug-autosave')) {
  console.log('Detailed auto-save state:', {
    user: !!user,
    enabled,
    title: draftDecision?.title,
    hasId: !!draftDecision?.id,
    argsLength: args.length
  })
}
```

### Logs Backend
```sql
-- Vérifier les décisions récentes d'un utilisateur
SELECT id, title, version, created_at, updated_at 
FROM decisions 
WHERE user_id = 'USER_ID_HERE' 
ORDER BY updated_at DESC 
LIMIT 10;

-- Vérifier les doublons potentiels
SELECT user_id, title, COUNT(*) as count
FROM decisions 
GROUP BY user_id, title 
HAVING COUNT(*) > 1;
```

## 🛠️ Tests Manuels

### Test 1 : Nouvelle Décision
```
1. Aller sur /platform
2. Créer nouvelle décision
3. Taper titre "Test Auto-Save"
4. Attendre 2 secondes
5. ✅ Vérifier log "✅ Auto-save successful" avec isNew: true
6. ✅ Vérifier que draftDecision.id est défini
```

### Test 2 : Modification Titre
```
1. Partir d'une décision sauvegardée
2. Modifier le titre
3. Attendre 2 secondes
4. ✅ Vérifier log avec isNew: false
5. ✅ Vérifier qu'aucun doublon n'est créé dans l'historique
```

### Test 3 : Modification Rapide (Debouncing)
```
1. Taper rapidement plusieurs caractères
2. ✅ Vérifier qu'un seul appel serveur est fait
3. ✅ Vérifier logs "Timer reset" dans la console
```

## 📊 Métriques à Surveiller

### Performance
```javascript
// Mesurer le temps de sauvegarde
const start = performance.now()
await upsertDecisionMutation.mutateAsync(...)
const duration = performance.now() - start
console.log(`Save duration: ${duration}ms`)
```

### Fréquence
```javascript
// Compter les sauvegardes par session
let saveCount = 0
// Dans saveFunction:
saveCount++
console.log(`Total saves this session: ${saveCount}`)
```

## 🚀 Améliorations Futures

### Sauvegarde Hors Ligne
```javascript
// Détecter la connexion
window.addEventListener('online', () => {
  // Retry pending saves
})

window.addEventListener('offline', () => {
  // Queue saves locally
})
```

### Résolution de Conflits UI
```typescript
// Afficher dialogue de résolution si conflit détecté
if (error.type === 'OptimisticLockError') {
  showConflictResolutionDialog({
    currentVersion: error.currentVersion,
    expectedVersion: error.expectedVersion,
    onResolve: (resolution) => {
      // Reload ou force update
    }
  })
}
```

### Historique des Versions
```sql
-- Table pour audit trail
CREATE TABLE decision_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  decision_id UUID REFERENCES decisions(id),
  version INTEGER,
  title VARCHAR(255),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
```

## 📝 Checklist de Vérification

Avant de modifier le système auto-save, vérifier :

- [ ] Tests existants passent
- [ ] Aucun doublon créé dans les tests
- [ ] Performance acceptable (<2s)
- [ ] Logs informatifs présents
- [ ] Gestion d'erreurs robuste
- [ ] Documentation mise à jour
- [ ] Migration de base de données testée

## 🆘 Contacts d'Urgence

En cas de problème critique en production :

1. **Désactiver l'auto-save** : `enabled: false` dans `DecisionPlatform.tsx`
2. **Revenir à la sauvegarde manuelle** temporairement
3. **Analyser les logs** Supabase et client
4. **Appliquer le hotfix** approprié

---

**Créé le** : 19 août 2025  
**Pour** : Système Auto-Save Robuste v1.0.0  
**Maintenance** : Vérifier ce guide à chaque modification majeure
