import { BarChart3, Brain, Lightbulb, Target } from "lucide-react"

export const steps = [
  {
    description: "Décrivez clairement la situation et le contexte de votre décision.",
    details: ["Contexte détaillé", "Enjeux identifiés", "Objectifs clairs"],
    icon: Target,
    number: 1,
    title: "Définissez votre décision"
  },
  {
    description: "Ajoutez vos arguments et notez-les de -10 à +10 selon leur importance.",
    details: ["Arguments pour/contre", "Notation pondérée", "Tri automatique"],
    icon: Lightbulb,
    number: 2,
    title: "Listez vos arguments"
  },
  {
    description: "L'IA analyse votre contexte et propose des arguments supplémentaires.",
    details: ["Analyse contextuelle", "Suggestions pertinentes", "Arguments manqués"],
    icon: Brain,
    number: 3,
    title: "Obtenez des suggestions IA"
  },
  {
    description: "La visualisation semi-circulaire vous donne une recommandation claire basée sur la règle 2:1.",
    details: ["Gauge interactive", "Règle 2:1 de Schulich", "Recommandation claire"],
    icon: BarChart3,
    number: 4,
    title: "Visualisez et décidez"
  }
]

export const principles = [
  {
    description: "Une décision est favorable si les arguments positifs sont au moins 2 fois supérieurs aux négatifs.",
    example: "14 points positifs vs 7 points négatifs = Décision favorable",
    title: "Règle 2:1 de Schulich"
  },
  {
    description: "Chaque argument est noté de -10 à +10 selon son importance réelle dans votre contexte.",
    example: "Un risque majeur (-8) pèse plus qu'un avantage mineur (+2)",
    title: "Pondération intelligente"
  },
  {
    description: "L'IA comprend votre situation et propose des arguments que vous n'auriez pas considérés.",
    example: "Suggestions basées sur des cas similaires et l'expertise sectorielle",
    title: "Analyse contextuelle"
  }
]
