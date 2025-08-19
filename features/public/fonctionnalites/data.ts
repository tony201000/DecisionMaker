import { BarChart3, Brain, Clock, Shield, Smartphone, Target, TrendingUp, Users, Zap } from "lucide-react"

export const features = [
  {
    benefits: ["Suggestions contextuelles", "Analyse sémantique", "Apprentissage continu"],
    description: "Notre IA analyse votre contexte et génère des arguments pertinents que vous n'auriez peut-être pas considérés.",
    highlight: "Nouveau",
    icon: Brain,
    title: "Intelligence Artificielle Avancée"
  },
  {
    benefits: ["Interface intuitive", "Temps réel", "Responsive design"],
    description: "Gauge semi-circulaire dynamique basée sur la méthode Schulich pour une compréhension instantanée.",
    highlight: "Populaire",
    icon: BarChart3,
    title: "Visualisation Interactive"
  },
  {
    benefits: ["Chiffrement AES-256", "Conformité RGPD", "Audit de sécurité"],
    description: "Chiffrement de bout en bout et conformité RGPD pour protéger vos données sensibles.",
    highlight: "",
    icon: Shield,
    title: "Sécurité Maximale"
  },
  {
    benefits: ["Application mobile", "Synchronisation cloud", "Mode hors-ligne"],
    description: "Accédez à vos analyses depuis n'importe quel appareil avec synchronisation automatique.",
    highlight: "",
    icon: Smartphone,
    title: "Multi-Plateforme"
  },
  {
    benefits: ["Partage sécurisé", "Commentaires", "Historique des versions"],
    description: "Partagez vos analyses et prenez des décisions collectives avec votre équipe.",
    highlight: "Pro",
    icon: Users,
    title: "Collaboration d'Équipe"
  },
  {
    benefits: ["Recherche avancée", "Filtres personnalisés", "Export de données"],
    description: "Retrouvez et analysez toutes vos décisions passées pour améliorer votre processus.",
    highlight: "",
    icon: Clock,
    title: "Historique Complet"
  }
]

export const stats = [
  {
    icon: Target,
    label: "Décisions analysées",
    number: "10,000+"
  },
  {
    icon: TrendingUp,
    label: "Satisfaction client",
    number: "95%"
  },
  {
    icon: Zap,
    label: "Amélioration des résultats",
    number: "2.5x"
  },
  {
    icon: Clock,
    label: "Support disponible",
    number: "24/7"
  }
]
