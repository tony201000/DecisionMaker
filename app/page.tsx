"use client"

import { ArrowRight, BarChart3, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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
                <Link href="/app">
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

      {/* ... existing sections ... */}
      <section id="fonctionnalites" className="py-20 bg-muted/30">
        {/* ... existing features content ... */}
      </section>

      <section id="methode" className="py-20">
        {/* ... existing method content ... */}
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
              <Link href="/app">
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

      {/* ... existing footer ... */}
    </div>
  )
}
