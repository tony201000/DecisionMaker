# 🎯 DecisionMaker

> **Prenez des décisions éclairées avec la méthode Schulich enrichie par l'intelligence artificielle**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/tony201000p/v0-decision-maker)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

## 📋 Table des matières

- [🌟 Vue d'ensemble](#-vue-densemble)
- [🧠 La méthode Schulich](#-la-méthode-schulich)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠 Tech Stack](#-tech-stack)
- [🏗 Architecture](#-architecture)
- [🚀 Installation](#-installation)
- [📖 Utilisation](#-utilisation)
- [📁 Structure du projet](#-structure-du-projet)
- [🌐 Déploiement](#-déploiement)
- [🤝 Contribution](#-contribution)

## 🌟 Vue d'ensemble

**DecisionMaker** transforme la façon dont vous prenez vos décisions importantes. Cette plateforme web combine la méthode de prise de décision éprouvée du milliardaire canadien Seymour Schulich avec la puissance de l'intelligence artificielle moderne.

### Le problème résolu

Face aux grandes décisions de la vie - changement de carrière, achat immobilier, choix d'investissement - nous souffrons souvent de :
- **Paralysie de l'analyse** : Trop d'options, pas assez de structure
- **Décisions émotionnelles** : Un seul facteur domine tous les autres  
- **Regrets futurs** : Absence de traçabilité du processus de décision
- **Oublis d'éléments cruciaux** : Manque de perspective globale

### La solution DecisionMaker

✅ **Méthode structurée** : Framework en 3 étapes testé par un milliardaire  
✅ **IA assistante** : Suggestions d'arguments que vous n'aviez pas envisagés  
✅ **Visualisation claire** : Graphiques et scores pour une analyse objective  
✅ **Historique complet** : Traçabilité et révision de vos décisions passées

## 🧠 La méthode Schulich

### Qui est Seymour Schulich ?

Seymour Schulich est un milliardaire canadien, philanthrope et co-fondateur de Franco-Nevada, une société de redevances minières extrêmement prospère. Sa méthode de prise de décision, décrite dans son livre "Get Smarter", a fait ses preuves dans le monde des affaires et des investissements.

### Les 3 étapes de la méthode

La méthode Schulich transforme une simple liste de "pour/contre" en un outil de décision puissant :

#### 1. 📝 Lister les points positifs
- Notez tous les avantages de votre décision
- Attribuez une note de **1 à 10** selon l'importance pour vous
- 10 = extrêmement important, 1 = légèrement important

#### 2. ⚠️ Lister les points négatifs  
- Identifiez tous les inconvénients et risques
- Notez chaque élément de **1 à 10** selon la gravité
- 10 = dealbreaker majeur, 1 = inconvénient mineur

#### 3. 🧮 Calculer et décider
- Additionnez les scores de chaque colonne
- **Si positifs ÷ négatifs ≥ 2**, prenez la décision
- Cette marge de sécurité protège contre les erreurs d'évaluation

### Pourquoi cette méthode fonctionne ?

✅ **Évite les décisions dominées par une seule émotion**  
Un élément très positif (10/10) peut être contrebalancé par plusieurs petits négatifs

✅ **Force l'exhaustivité**  
Vous devez considérer TOUS les facteurs, pas seulement les évidents

✅ **Apporte de l'objectivité**  
La notation chiffrée réduit le poids des biais émotionnels

✅ **Crée un historique**  
Vous pouvez réviser votre raisonnement plus tard pour éviter les regrets

> 💡 **Exemple concret** : Changer de travail avec 61 points positifs vs 27 négatifs = ratio de 2.26, donc décision validée !

*Source : [Morningstar - 3 simple steps to tackle life's big decisions](https://www.morningstar.com.au/personal-finance/bookworm-3-simple-steps-tackle-lifes-big-decisions)*
## ✨ Fonctionnalités

### 🎯 Méthode Schulich Digitalisée
- **3 étapes guidées** : Interface intuitive pour appliquer la méthode
- **Notation 1-10** : Système de pondération intégré
- **Calcul automatique** : Ratio et recommandations instantanés
- **Validation intelligente** : Vérification de la marge de sécurité (≥2)

### 🤖 Intelligence Artificielle
- **Suggestions contextuelles** : L'IA analyse votre décision et propose des arguments pertinents
- **Enrichissement automatique** : Découvrez des aspects que vous n'aviez pas envisagés
- **Arguments équilibrés** : Suggestions pour les deux côtés de la balance
- **Explications détaillées** : Chaque suggestion est accompagnée de son raisonnement

### 📊 Visualisation & Analyse
- **Graphiques interactifs** : Visualisation des scores en temps réel
- **Comparaison visuelle** : Barres de progression pour positifs vs négatifs  
- **Indicateur de confiance** : Badge coloré selon le ratio obtenu
- **Tendances historiques** : Évolution de vos patterns de décision

### � Authentification & Sécurité
- **Authentification Supabase** sécurisée (email/password)
- **Protection des données** avec Row Level Security
- **Sessions persistantes** pour une expérience fluide
- **Reset de mot de passe** via email sécurisé

### 🗂 Gestion & Historique
- **Sauvegarde automatique** : Vos décisions sont sauvées en temps réel
- **Historique complet** : Accès à toutes vos décisions passées
- **Recherche avancée** : Filtres par titre, date, score ou statut
- **Export des données** : Téléchargez vos analyses pour référence externe

## 🛠 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React avec App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management moderne
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling moderne
- **[Radix UI](https://www.radix-ui.com/)** - Composants accessibles

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
- **[PostgreSQL](https://www.postgresql.org/)** - Base de données relationnelle
- **[Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)** - Sécurité des données

### AI & Services
- **[Groq AI](https://groq.com/)** - Suggestions d'arguments intelligentes
- **AI SDK** - Intégration IA simplifiée

### Development Tools
- **[Biome](https://biomejs.dev/)** - Linting et formatting
- **[Vercel](https://vercel.com/)** - Déploiement et hosting
- **[Git](https://git-scm.com/)** - Contrôle de version

## 🏗 Architecture

### Structure par features
```
├── app/                 # Next.js App Router
│   ├── (auth)/         # Routes d'authentification
│   ├── (protected)/    # Routes protégées (plateforme)
│   └── (public)/       # Pages publiques (landing, etc.)
├── components/          # Composants UI réutilisables
│   ├── ui/             # Composants de base (Button, Input, etc.)
│   ├── shared/         # Composants partagés (Header, CTA, etc.)
│   └── sidebar/        # Composants de la sidebar
├── features/           # Logique métier par domaine
│   ├── auth/           # Authentification
│   ├── decision/       # Gestion des décisions
│   ├── landing/        # Page d'accueil
│   └── platform/       # Interface principale
├── lib/                # Utilitaires et services
│   ├── stores/         # Stores Zustand (state management)
│   ├── services/       # Services API
│   ├── providers/      # Providers React
│   └── supabase/       # Configuration Supabase
└── hooks/              # Custom React hooks (interfaces Zustand)
```

### Principes architecturaux

#### 🏛 Feature-First Structure
```
features/
├── decision/     # Logique métier des décisions (méthode Schulich)
├── auth/        # Authentification utilisateur  
├── platform/    # Interface protégée principale
└── public/      # Pages marketing et landing
```

#### 🔄 Server-First Approach
- **Server Components** par défaut pour de meilleures performances
- **Client Components** seulement quand nécessaire (interactivité, hooks)
- **Server Actions** pour les mutations de données

#### 🎯 State Management Moderne
- **Zustand** : État global réactif avec DevTools
  - `decision-store.ts` : État de la décision en cours d'édition
  - `suggestions-store.ts` : Gestion des suggestions IA avec filtres et historique
  - `auth-store.ts` : État d'authentification
- **React Query** : Gestion du state serveur avec cache intelligent
- **Service Layer** : Classes de service pour la logique métier (`DecisionCrudService`)

#### 🎨 Design System
- **Tailwind CSS** : Styling utilitaire avec `decision-styles.ts` pour les patterns spécifiques
- **Radix UI** : Composants accessibles (WCAG 2.1 AA)
- **Shadcn/ui** : Système de composants cohérent

## 🚀 Installation

### Prérequis
- **Node.js** 18+ 
- **npm** ou **yarn**
- **Compte Supabase** (pour la base de données)
- **Clé API Groq** (pour l'IA)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/bbcollection-th/v0-DecisionMaker.git
cd v0-DecisionMaker
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env.local
```

Remplir les variables d'environnement :
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Setup de la base de données**
```bash
# Initialiser Supabase (si pas déjà fait)
npx supabase init

# Appliquer les migrations
npx supabase db push

# Générer les types TypeScript
npx supabase gen types typescript --local > supabase/types.ts
```

5. **Lancer en développement**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📖 Utilisation

### 🚀 Créer votre première décision Schulich

#### Étape 1 : Connexion
1. Créez un compte ou connectez-vous
2. Accédez à la plateforme via le dashboard

#### Étape 2 : Nouvelle décision  
1. Cliquez sur **"Nouvelle décision"**
2. Donnez un **titre clair** à votre dilemme
3. Ajoutez une **description détaillée** du contexte

#### Étape 3 : Arguments positifs (Pour)
1. Listez tous les **avantages** de votre décision
2. Pour chaque argument, attribuez une **note de 1 à 10**
   - 🔥 **10** : Avantage crucial, transformateur
   - 👍 **7-9** : Avantage important  
   - 💡 **4-6** : Avantage modéré
   - ✨ **1-3** : Petit plus appréciable

#### Étape 4 : Arguments négatifs (Contre)
1. Identifiez tous les **inconvénients** et risques
2. Notez chaque point de **1 à 10** selon la gravité
   - 💥 **10** : Dealbreaker, risque majeur
   - ⚠️ **7-9** : Problème sérieux
   - 😐 **4-6** : Inconvénient notable  
   - 🤏 **1-3** : Désagrément mineur

#### Étape 5 : Assistance IA
1. Cliquez sur **"Suggérer des arguments"**
2. L'IA analyse votre contexte et propose :
   - Arguments positifs que vous n'aviez pas vus
   - Risques potentiels à considérer
   - Perspectives alternatives
3. Ajoutez les suggestions pertinentes à votre analyse

#### Étape 6 : Décision finale
1. **Visualisez les scores** : graphique en temps réel
2. **Vérifiez le ratio** : Positifs ÷ Négatifs
   - 🟢 **≥ 2.0** : Décision recommandée (Go !)
   - 🟡 **1.5-1.9** : À reconsidérer (Attention)
   - 🔴 **< 1.5** : Décision déconseillée (Stop)
3. **Prenez votre décision** en toute confiance

### 🔄 Suivi et révision

- **Consultez l'historique** : Toutes vos décisions passées
- **Analysez vos patterns** : Tendances dans vos choix
- **Révisez après coup** : Était-ce la bonne décision ?
- **Apprenez de l'expérience** : Améliorez votre processus

### 💡 Exemples d'usage

**Carrière** : Changer de travail, négocier une promotion, créer une entreprise  
**Immobilier** : Acheter vs louer, déménager, investir  
**Finances** : Investissements, épargne retraite, gros achats  
**Personnel** : Relations, éducation des enfants, décisions de vie

## 📁 Structure du projet

<details>
<summary>Voir la structure détaillée</summary>

```
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (auth)/                   # Groupe de routes - Authentification
│   │   ├── 📁 login/                # Page de connexion
│   │   ├── 📁 sign-up/              # Page d'inscription
│   │   └── 📁 forgot-password/      # Reset de mot de passe
│   ├── 📁 (protected)/              # Groupe de routes - Protégées
│   │   └── 📁 platform/             # Interface principale
│   ├── 📁 (public)/                 # Groupe de routes - Publiques
│   │   ├── 📁 fonctionnalites/      # Page fonctionnalités
│   │   ├── 📁 methode/              # Page méthode
│   │   └── 📁 temoignages/          # Page témoignages
│   └── 📁 api/                      # API Routes
├── 📁 components/                   # Composants UI
│   ├── 📁 ui/                       # Composants de base
│   ├── 📁 shared/                   # Composants partagés
│   └── 📁 sidebar/                  # Composants sidebar
├── 📁 features/                     # Logique métier par domaine
│   ├── 📁 auth/                     # Authentification
│   ├── 📁 decision/                 # Gestion des décisions
│   ├── 📁 landing/                  # Page d'accueil
│   └── 📁 platform/                 # Interface principale
├── 📁 lib/                          # Utilitaires et services
│   ├── 📁 services/                 # Services API
│   ├── 📁 providers/                # React Providers
│   ├── 📁 supabase/                 # Configuration Supabase
│   └── 📁 actions/                  # Server Actions
├── 📁 hooks/                        # Custom React Hooks
├── 📁 types/                        # Types TypeScript
├── 📁 supabase/                     # Configuration Supabase
│   └── 📁 migrations/               # Migrations SQL
└── 📁 public/                       # Assets statiques
```
</details>

## 🌐 Déploiement

### Vercel (Recommandé)

1. **Connecter le repository** à Vercel
> `vercel link`
2. **Configurer les variables d'environnement** dans le dashboard Vercel
3. **Déployer** automatiquement à chaque push sur `main`

### Variables d'environnement pour production

```env
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=your_prod_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_prod_supabase_anon_key

# Groq AI Production
GROQ_API_KEY=your_prod_groq_api_key

# Production URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Ce projet vise à démocratiser l'accès à une méthode de prise de décision éprouvée.

### Comment contribuer

1. **Fork** le projet sur GitHub
2. **Créer une branche** pour votre fonctionnalité
   ```bash
   git checkout -b feature/amelioration-ia
   ```
3. **Développer** en suivant les conventions du projet
4. **Tester** vos modifications
   ```bash
   npm run typecheck
   npm run lint
   ```
5. **Commit** avec des messages clairs
   ```bash
   git commit -m "feat: améliore les suggestions IA pour les décisions financières"
   ```
6. **Push** et créer une **Pull Request**

### Standards de développement

- **Code Quality** : Biome pour le linting et formatting
- **Types** : TypeScript strict obligatoire
- **Architecture** : Respecter les patterns feature-first
- **Accessibilité** : WCAG 2.1 AA compliance
- **Tests** : Couvrir les nouvelles fonctionnalités

### Idées de contributions

🤖 **IA & Machine Learning**
- Améliorer la qualité des suggestions
- Personnalisation basée sur l'historique utilisateur
- Détection automatique de biais cognitifs

📊 **Analytics & Insights**  
- Métriques avancées sur les patterns de décision
- Comparaison avec des benchmarks sectoriels
- Prédiction de satisfaction post-décision

🎨 **UX/UI**
- Mode collaboratif pour les équipes
- Templates de décisions par domaine
- Amélioration mobile et accessibilité

🔧 **Technique**
- Performance et optimisations
- Tests automatisés
- Intégrations externes (calendrier, CRM, etc.)

## 📚 Références et ressources

### Sur la méthode Schulich
- 📖 [Get Smarter by Seymour Schulich](https://www.amazon.com/Get-Smarter-Seymour-Schulich/dp/1770412395) - Le livre original
- � [Article Morningstar](https://www.morningstar.com.au/personal-finance/bookworm-3-simple-steps-tackle-lifes-big-decisions) - Explication détaillée avec exemples
- 🏢 [Franco-Nevada Corporation](https://www.franco-nevada.com/) - La société co-fondée par Seymour Schulich

### Recherche en prise de décision
- 📖 [Thinking, Fast and Slow](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow) - Daniel Kahneman sur les biais cognitifs
- 📰 [Harvard Business Review - Decision Making](https://hbr.org/topic/decision-making) - Articles sur les meilleures pratiques
- 🎓 [Behavioral Economics Research](https://www.behavioraleconomics.com/) - Comprendre les biais dans les décisions

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🙏 Remerciements

- **[Seymour Schulich](https://en.wikipedia.org/wiki/Seymour_Schulich)** - Pour sa méthode révolutionnaire de prise de décision
- **[Franco-Nevada](https://www.franco-nevada.com/)** - Exemple concret du succès de cette méthode  
- **[Morningstar](https://www.morningstar.com.au/)** - Pour l'excellent article explicatif sur la méthode
- **[Vercel](https://vercel.com/)** - Hébergement et outils de développement
- **[Supabase](https://supabase.com/)** - Infrastructure backend complète
- **[Groq](https://groq.com/)** - Intelligence artificielle rapide et performante
- **[v0.dev](https://v0.dev/)** - Aide au développement initial de l'interface

---

<p align="center">
  <strong>Prenez de meilleures décisions. Vivez sans regrets.</strong>
</p>

<p align="center">
  <a href="https://vercel.com/tony201000p/v0-decision-maker" target="_blank">
    🚀 <strong>Essayer DecisionMaker</strong>
  </a>
</p>

<p align="center">
  <i>Basé sur une méthode utilisée par un milliardaire canadien qui a co-fondé l'une des sociétés minières les plus prospères au monde.</i>
</p>
