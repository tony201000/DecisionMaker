"use client"

import { ArrowRight, Brain, BarChart3, Users, Shield, Zap, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">DecisionAI</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#fonctionnalites" className="text-muted-foreground hover:text-foreground transition-colors">
                Fonctionnalités
              </a>
              <a href="#methode" className="text-muted-foreground hover:text-foreground transition-colors">
                Méthode
              </a>
              <a href="#temoignages" className="text-muted-foreground hover:text-foreground transition-colors">
                Témoignages
              </a>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button size="sm">
                  Commencer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-card via-background to-muted opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Prenez des décisions
                  <span className="text-primary"> éclairées</span> avec l'IA
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Utilisez la méthode Schulich enrichie par l'intelligence artificielle pour analyser vos arguments et
                  prendre les meilleures décisions.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="w-full sm:w-auto">
                    Commencer gratuitement
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    Voir la démo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Gratuit pour commencer</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <span>Aucune carte requise</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Analyse de Décision</h3>
                    {/* Semi-circular gauge visualization */}
                    <div className="relative w-64 h-32 mx-auto">
                      <svg viewBox="0 0 200 100" className="w-full h-full">
                        <defs>
                          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="25%" stopColor="#f97316" />
                            <stop offset="50%" stopColor="#eab308" />
                            <stop offset="75%" stopColor="#84cc16" />
                            <stop offset="100%" stopColor="#22c55e" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 20 80 A 60 60 0 0 1 180 80"
                          fill="none"
                          stroke="url(#gaugeGradient)"
                          strokeWidth="12"
                          strokeLinecap="round"
                        />
                        <line
                          x1="100"
                          y1="80"
                          x2="100"
                          y2="50"
                          stroke="#164e63"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        <circle cx="100" cy="80" r="4" fill="#164e63" />
                      </svg>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground font-bold">
                          7
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Négatifs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-accent">Favorable</p>
                        <p className="text-xs text-muted-foreground">Recommandation</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                          14
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Positifs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fonctionnalites" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Fonctionnalités puissantes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment notre plateforme révolutionne votre processus de prise de décision
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Suggestions IA</h3>
                <p className="text-muted-foreground">
                  L'intelligence artificielle analyse votre contexte et propose des arguments pertinents que vous
                  n'auriez peut-être pas considérés.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Visualisation claire</h3>
                <p className="text-muted-foreground">
                  Gauge semi-circulaire intuitive basée sur la méthode Schulich pour visualiser instantanément
                  l'équilibre de vos arguments.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Données sécurisées</h3>
                <p className="text-muted-foreground">
                  Vos décisions sont stockées de manière sécurisée et accessible uniquement par vous. Confidentialité
                  garantie.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Interface intuitive</h3>
                <p className="text-muted-foreground">
                  Slider de notation de -10 à +10, tri automatique des arguments, et interface responsive pour tous vos
                  appareils.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Collaboration</h3>
                <p className="text-muted-foreground">
                  Partagez vos analyses avec votre équipe et prenez des décisions collectives éclairées.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Historique complet</h3>
                <p className="text-muted-foreground">
                  Retrouvez toutes vos décisions passées, suivez leur évolution et apprenez de vos choix précédents.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section id="methode" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">La méthode Schulich enrichie par l'IA</h2>
              <p className="text-lg text-muted-foreground">
                Notre plateforme s'appuie sur la méthode éprouvée de Seymour Schulich, enrichie par l'intelligence
                artificielle pour vous aider à prendre des décisions plus éclairées.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-primary-foreground font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Définissez votre décision</h4>
                    <p className="text-muted-foreground">
                      Décrivez clairement la situation et le contexte de votre décision.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-primary-foreground font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Listez vos arguments</h4>
                    <p className="text-muted-foreground">
                      Ajoutez vos arguments et notez-les de -10 à +10 selon leur importance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-accent-foreground font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Obtenez des suggestions IA</h4>
                    <p className="text-muted-foreground">
                      L'IA analyse votre contexte et propose des arguments supplémentaires.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-primary-foreground font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Visualisez et décidez</h4>
                    <p className="text-muted-foreground">
                      La visualisation semi-circulaire vous donne une recommandation claire basée sur la règle 2:1.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-card-foreground text-center">Exemple d'analyse</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-sm text-green-800 dark:text-green-200">Opportunité de croissance</span>
                    <span className="text-sm font-bold text-green-800 dark:text-green-200">+8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-sm text-green-800 dark:text-green-200">Équipe motivée</span>
                    <span className="text-sm font-bold text-green-800 dark:text-green-200">+6</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="text-sm text-red-800 dark:text-red-200">Investissement initial élevé</span>
                    <span className="text-sm font-bold text-red-800 dark:text-red-200">-5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="text-sm text-red-800 dark:text-red-200">Risque de marché</span>
                    <span className="text-sm font-bold text-red-800 dark:text-red-200">-2</span>
                  </div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <p className="text-accent font-semibold">Recommandation: Favorable</p>
                  <p className="text-xs text-muted-foreground mt-1">Ratio 2:1 respecté (14 vs 7)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">
              Prêt à prendre de meilleures décisions ?
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Rejoignez des milliers de professionnels qui utilisent déjà notre plateforme pour optimiser leurs
              décisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Essayer la démo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">DecisionAI</span>
              </div>
              <p className="text-muted-foreground">
                La plateforme d'aide à la décision alimentée par l'intelligence artificielle.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Produit</h4>
              <div className="space-y-2">
                <a
                  href="#fonctionnalites"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Fonctionnalités
                </a>
                <a href="#methode" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Méthode
                </a>
                <Link href="/" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Démo
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Compte</h4>
              <div className="space-y-2">
                <Link
                  href="/auth/sign-up"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  S'inscrire
                </Link>
                <Link
                  href="/auth/login"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Centre d'aide
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Confidentialité
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 DecisionAI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
