# Diagrammes de Séquence - Système Auto-Save

## Séquence Complète : Modification de Titre avec Sauvegarde

```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant UI as 🖥️ Interface
    participant AS as 🔄 useAutoSave
    participant DB as 🏛️ useDebounce
    participant RQ as 📡 React Query
    participant SB as 🗄️ Supabase
    participant ST as 💾 Store Zustand

    %% Modification initiale
    U->>UI: Tape "Mon nouveau titre"
    UI->>ST: updateDraftField("title", "Mon nouveau titre")
    ST->>AS: Trigger useEffect (deps changed)
    
    %% Vérification des changements
    AS->>AS: Comparer avec savedDataRef
    Note over AS: title: "Ancien" ≠ "Mon nouveau titre" ✓
    AS->>AS: hasChanged = true
    
    %% Conditions de sauvegarde
    AS->>AS: Vérifier conditions
    Note over AS: user ✓, enabled ✓, title ✓, hasChanged ✓
    AS->>DB: debouncedCallback()
    
    %% Debouncing (attente 2s)
    Note over DB: Attendre 2000ms...
    U->>UI: Continue à taper...
    UI->>ST: updateDraftField("title", "Mon nouveau titre final")
    ST->>AS: Trigger useEffect again
    AS->>DB: debouncedCallback() (reset timer)
    Note over DB: Timer reset, attendre 2000ms...
    
    %% Exécution finale après silence
    Note over DB: 2s de silence écoulées
    DB->>AS: Exécuter saveFunction
    
    %% Préparation des données
    AS->>AS: Préparer decisionData
    Note over AS: title: "Mon nouveau titre final"<br/>description: "..."<br/>existingId: "123abc"
    AS->>RQ: upsertDecisionMutation.mutateAsync()
    
    %% Appel serveur
    RQ->>SB: POST /rpc/upsert_decision
    Note over SB: p_existing_id: "123abc"<br/>p_title: "Mon nouveau titre final"<br/>p_user_id: "user123"
    
    %% Logique serveur SQL
    SB->>SB: Chercher par existing_id
    Note over SB: SELECT * FROM decisions<br/>WHERE id = '123abc' AND user_id = 'user123'
    SB->>SB: Trouvé ✓ → v_decision_id = '123abc'
    
    SB->>SB: UPDATE décision existante
    Note over SB: UPDATE decisions SET<br/>title = 'Mon nouveau titre final',<br/>version = version + 1,<br/>updated_at = NOW()<br/>WHERE id = '123abc'
    
    SB->>SB: Gérer les arguments
    Note over SB: DELETE FROM arguments WHERE decision_id = '123abc'<br/>INSERT INTO arguments (...)
    
    %% Réponse serveur
    SB-->>RQ: Succès avec données mises à jour
    Note over RQ: { success: true, data: { decision: {...}, isNew: false }}
    
    %% Traitement côté client
    RQ-->>AS: Result successful
    AS->>AS: Log "✅ Auto-save successful"
    AS->>AS: isNew = false, pas de mise à jour ID
    AS->>AS: Mettre à jour savedDataRef
    Note over AS: savedDataRef.current = {<br/>title: "Mon nouveau titre final",<br/>description: "...",<br/>argsLength: 3<br/>}
    
    %% Mise à jour cache
    RQ->>RQ: Invalider ["decisionHistory", "user123"]
    RQ->>RQ: Mettre à jour cache ["decision", "123abc"]
    
    %% Feedback utilisateur
    AS-->>UI: isSaving: false
    UI-->>U: Indicateur sauvegardé ✅
```

## Séquence Problématique Résolue : Première Sauvegarde

### AVANT (Problématique - Doublons)
```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant AS as 🔄 useAutoSave
    participant SB as 🗄️ Supabase
    participant ST as 💾 Store

    U->>AS: Première saisie "Titre Initial"
    Note over AS: draftDecision.id = undefined ❌
    AS->>SB: upsert_decision(existingId=undefined)
    SB->>SB: Pas d'ID → chercher par titre
    SB->>SB: Pas trouvé → CREATE nouvelle décision
    SB-->>AS: { id: "123abc", isNew: true }
    AS->>AS: ❌ PAS de mise à jour du store
    Note over ST: draftDecision.id reste undefined
    
    %% Changement de titre - PROBLÈME
    U->>AS: Change titre vers "Nouveau Titre"
    Note over AS: existingId = undefined (toujours!) ❌
    AS->>SB: upsert_decision(existingId=undefined, title="Nouveau Titre")
    SB->>SB: Chercher par titre "Nouveau Titre"
    SB->>SB: Pas trouvé → CREATE autre décision ❌❌
    Note over SB: DOUBLON CRÉÉ!
```

### APRÈS (Corrigé - Pas de Doublons)
```mermaid
sequenceDiagram
    participant U as 👤 Utilisateur
    participant AS as 🔄 useAutoSave
    participant SB as 🗄️ Supabase
    participant ST as 💾 Store

    U->>AS: Première saisie "Titre Initial"
    Note over AS: draftDecision.id = undefined
    AS->>SB: upsert_decision(existingId=undefined)
    SB->>SB: CREATE nouvelle décision
    SB-->>AS: { id: "123abc", isNew: true }
    AS->>ST: ✅ updateDraftField("id", "123abc")
    Note over ST: draftDecision.id = "123abc" ✅
    
    %% Changement de titre - RÉSOLU
    U->>AS: Change titre vers "Nouveau Titre"
    Note over AS: existingId = "123abc" ✅
    AS->>SB: upsert_decision(existingId="123abc", title="Nouveau Titre")
    SB->>SB: Chercher par ID "123abc"
    SB->>SB: Trouvé ✓ → UPDATE décision existante ✅
    Note over SB: PAS DE DOUBLON!
```

## États du Système

### Store Zustand - État de la Décision
```mermaid
stateDiagram-v2
    [*] --> Nouveau
    Nouveau: draftDecision = { title: "", description: "", id: undefined }
    
    Nouveau --> EnCours : Utilisateur commence à taper
    EnCours: draftDecision = { title: "...", description: "...", id: undefined }
    
    EnCours --> Sauvegarde : Auto-save déclenché
    Sauvegarde: isSaving = true
    
    Sauvegarde --> Sauvegardé : Succès
    Sauvegardé: draftDecision = { title: "...", description: "...", id: "123abc" }
    Sauvegardé: savedDataRef synchronisé
    
    Sauvegarde --> Erreur : Échec
    Erreur: Message d'erreur loggé
    Erreur --> EnCours : Retry possible
    
    Sauvegardé --> EnCours : Nouvelle modification
    note right of EnCours
        Toutes les modifications suivantes
        utilisent existingId = "123abc"
        → Pas de doublons
    end note
```

## Timing Critique - Debouncing

```mermaid
gantt
    title Exemple de Timing Auto-Save avec Debouncing
    dateFormat X
    axisFormat %Ls
    
    section Utilisateur Tape
    T                    :milestone, t1, 0, 0ms
    i                    :milestone, t2, 200, 0ms
    t                    :milestone, t3, 400, 0ms
    r                    :milestone, t4, 600, 0ms
    e                    :milestone, t5, 800, 0ms
    (espace)             :milestone, t6, 1000, 0ms
    M                    :milestone, t7, 1200, 0ms
    o                    :milestone, t8, 1400, 0ms
    n                    :milestone, t9, 1600, 0ms
    
    section Debounce Timers
    Timer 1 (T)          :timer1, 0, 2000
    Timer 2 (i)          :timer2, 200, 2000
    Timer 3 (t)          :timer3, 400, 2000
    Timer 4 (r)          :timer4, 600, 2000
    Timer 5 (e)          :timer5, 800, 2000
    Timer 6 (space)      :timer6, 1000, 2000
    Timer 7 (M)          :timer7, 1200, 2000
    Timer 8 (o)          :timer8, 1400, 2000
    Timer Final (n)      :done, timer9, 1600, 2000
    
    section Sauvegarde
    Execution            :crit, save, 3600, 200
```

## Points de Défaillance et Récupération

```mermaid
flowchart TD
    A[Auto-Save Déclenché] --> B{Network Available?}
    B -->|Non| C[Queue for Retry]
    B -->|Oui| D[Send to Supabase]
    
    D --> E{Response OK?}
    E -->|Timeout| F[Retry with Backoff]
    E -->|Server Error| F
    E -->|Client Error| G[Log & Skip]
    E -->|Success| H[Update Store & Cache]
    
    C --> I[Network Restored]
    I --> D
    
    F --> J{Max Retries?}
    J -->|No| K[Wait & Retry]
    J -->|Yes| G
    
    K --> D
    
    classDef error fill:#ffebee
    classDef success fill:#e8f5e8
    classDef warning fill:#fff3e0
    
    class C,F,G,J error
    class H,I success
    class B,E warning
```

---

**Note** : Ces diagrammes montrent les interactions critiques du système. En cas de problème, référez-vous à ces séquences pour identifier où le flux peut être interrompu.
