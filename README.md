# 🎯 DecisionMaker

> **Une plateforme intelligente d'aide à la décision basée sur la méthode Schulich et enrichie par l'intelligence artificielle**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/tony201000p/v0-decision-maker)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités](#-fonctionnalités)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)

## 🌟 Vue d'ensemble

**DecisionMaker** est une plateforme web moderne qui révolutionne la prise de décision en combinant :

- 🧠 **La méthode éprouvée de Seymour Schulich** pour structurer les décisions
- 🤖 **L'intelligence artificielle** pour suggérer des arguments pertinents
- 📊 **Des visualisations interactives** pour analyser les options
- ⚡ **Une interface intuitive** pour une expérience utilisateur optimale

### Pourquoi DecisionMaker ?

- **Décisions éclairées** : Analysez tous les aspects avant de choisir
- **Gain de temps** : L'IA vous suggère des arguments que vous n'aviez pas envisagés
- **Traçabilité** : Gardez un historique de vos décisions importantes
- **Collaboration** : Partagez et discutez vos décisions en équipe

## ✨ Fonctionnalités

### 🎯 Core Features
- **Création de décisions** avec titre et description
- **Gestion d'arguments** pour et contre avec pondération
- **Suggestions IA** d'arguments basées sur le contexte
- **Visualisation graphique** des scores et tendances
- **Historique des décisions** avec recherche et filtres
- **Recommandations intelligentes** basées sur l'analyse

### 🔐 Authentification & Sécurité
- **Authentification Supabase** (email/password, OAuth)
- **Protection des routes** pour les pages sensibles
- **Gestion des sessions** sécurisée
- **Reset de mot de passe** via email

### 🎨 Interface Utilisateur
- **Design system** cohérent avec Tailwind CSS
- **Mode sombre/clair** automatique
- **Interface responsive** pour mobile et desktop
- **Composants réutilisables** avec Radix UI
- **Animations fluides** et transitions

### 📊 Analytics & Insights
- **Statistiques de décision** (nombre d'arguments, scores)
- **Graphiques interactifs** avec visualisation des données
- **Tendances temporelles** de vos décisions
- **Export des données** pour analyse externe

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
- **State Management Moderne** : Zustand pour l'état global, React Query pour le serveur
- **Separation of Concerns** : Logique métier séparée de l'UI
- **Composants réutilisables** : DRY principle appliqué
- **Type Safety** : TypeScript strict pour éviter les erreurs
- **Performance** : Server Components et optimisations Next.js
- **Accessibilité** : WCAG 2.1 AA compliance

### Gestion d'état
- **Zustand** : État global (UI, décisions, auth, suggestions IA)
- **React Query** : État serveur (requêtes Supabase, cache)
- **useState** : État local des composants uniquement

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

### Créer votre première décision

1. **S'inscrire/Se connecter** via l'interface d'authentification
2. **Accéder à la plateforme** depuis le menu principal
3. **Créer une nouvelle décision** en cliquant sur "Nouvelle décision"
4. **Ajouter un titre** et une description de votre dilemme
5. **Lister les arguments** pour et contre avec leur poids
6. **Demander des suggestions IA** pour enrichir votre analyse
7. **Analyser les résultats** via le graphique et les scores
8. **Prendre votre décision** en toute confiance !

### Fonctionnalités avancées

- **Historique** : Consultez toutes vos décisions passées
- **Filtrage** : Recherchez par titre, date ou score
- **Export** : Téléchargez vos données pour analyse externe
- **Partage** : Collaborez avec votre équipe sur des décisions importantes

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

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Créer une branche** pour votre feature (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir une Pull Request**

### Standards de développement

- **Code style** : Utilisez Biome pour le formatting (`npm run lint`)
- **Types** : Tout doit être typé avec TypeScript
- **Tests** : Ajoutez des tests pour les nouvelles fonctionnalités
- **Documentation** : Mettez à jour la documentation si nécessaire

## � Documentation

### Architecture State Management

La documentation complète de l'architecture Zustand se trouve dans :
- **[lib/stores/README.md](./lib/stores/README.md)** - Guide complet des stores
- **Hooks interfaces** : `/hooks/` - Interfaces pour les composants React
- **Types** : `/types/` - Définitions TypeScript

### Composants

- **UI Components** : `/components/ui/` - Composants de base réutilisables
- **Feature Components** : `/features/*/components/` - Composants métier
- **Shared Components** : `/components/shared/` - Composants transversaux

## �📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **[Seymour Schulich](https://en.wikipedia.org/wiki/Seymour_Schulich)** pour sa méthode de prise de décision
- **[Vercel](https://vercel.com/)** pour l'hébergement et les outils de développement
- **[Supabase](https://supabase.com/)** pour l'infrastructure backend
- **[v0.app](https://v0.app/)** pour l'aide au développement initial

---

<p align="center">
  Fait avec ❤️ pour améliorer vos décisions
</p>

<p align="center">
  <a href="https://vercel.com/tony201000p/v0-decision-maker">🚀 Voir la démo live</a>
</p>
