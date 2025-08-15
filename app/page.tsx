"use client"

import { ArrowRight, BarChart3, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function LandingPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

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
              {loading ? (
                <div className="flex space-x-2">
                  <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
                  <div className="w-24 h-8 bg-muted animate-pulse rounded"></div>
                </div>
              ) : user ? (
                <Link href="/app">
                  <Button size="sm">
                    Accéder à l'application
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
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
                </>
              )}
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
                {loading ? (
                  <div className="flex space-x-4">
                    <div className="w-48 h-12 bg-muted animate-pulse rounded"></div>
                    <div className="w-32 h-12 bg-muted animate-pulse rounded"></div>
                  </div>
                ) : user ? (
                  <>
                    <Link href="/app">
                      <Button size="lg" className="w-full sm:w-auto">
                        Accéder à l'application
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/app">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                        Nouvelle analyse
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez comment notre plateforme révolutionne votre processus de prise de décision
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Suggestions IA</h3>
              <p className="text-muted-foreground">
                L'intelligence artificielle analyse votre contexte et propose des arguments pertinents que vous n'auriez
                peut-être pas considérés.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Visualisation claire</h3>
              <p className="text-muted-foreground">
                Gauge semi-circulaire intuitive basée sur la méthode Schulich pour visualiser instantanément l'équilibre
                de vos arguments.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Données sécurisées</h3>
              <p className="text-muted-foreground">
                Vos décisions sont stockées de manière sécurisée et accessible uniquement par vous. Confidentialité
                garantie.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Interface intuitive</h3>
              <p className="text-muted-foreground">
                Slider de notation de -10 à +10, tri automatique des arguments, et interface responsive pour tous vos
                appareils.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Collaboration</h3>
              <p className="text-muted-foreground">
                Partagez vos analyses avec votre équipe et prenez des décisions collectives éclairées.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">Historique complet</h3>
              <p className="text-muted-foreground">
                Retrouvez toutes vos décisions passées, suivez leur évolution et apprenez de vos choix précédents.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Method Section */}
      <section id="methode" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">La méthode Schulich enrichie par l'IA</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Notre plateforme s'appuie sur la méthode éprouvée de Seymour Schulich, enrichie par l'intelligence
              artificielle pour vous aider à prendre des décisions plus éclairées.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground">Définissez votre décision</h3>
              <p className="text-muted-foreground">
                Décrivez clairement la situation et le contexte de votre décision.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground">Listez vos arguments</h3>
              <p className="text-muted-foreground">
                Ajoutez vos arguments et notez-les de -10 à +10 selon leur importance.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">Obtenez des suggestions IA</h3>
              <p className="text-muted-foreground">
                L'IA analyse votre contexte et propose des arguments supplémentaires.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto">
                4
              </div>
              <h3 className="text-xl font-semibold text-foreground">Visualisez et décidez</h3>
              <p className="text-muted-foreground">
                La visualisation semi-circulaire vous donne une recommandation claire basée sur la règle 2:1.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-xl border border-border max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-card-foreground mb-6 text-center">Exemple d'analyse</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-card-foreground">Opportunité de croissance</span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  +8
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-card-foreground">Équipe motivée</span>
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  +6
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <span className="text-card-foreground">Investissement initial élevé</span>
                <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  -5
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                <span className="text-card-foreground">Risque de marché</span>
                <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  -2
                </span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-lg font-semibold text-primary mb-2">Recommandation: Favorable</p>
              <p className="text-sm text-muted-foreground">Ratio 2:1 respecté (14 vs 7)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="py-20">
        {/* Testimonials content here */}
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
              {loading ? (
                <div className="flex space-x-4 justify-center">
                  <div className="w-40 h-12 bg-primary-foreground/20 animate-pulse rounded"></div>
                  <div className="w-32 h-12 bg-primary-foreground/20 animate-pulse rounded"></div>
                </div>
              ) : user ? (
                <>
                  <Link href="/app">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Accéder à l'application
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/app">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Nouvelle analyse
                    </Button>
                  </Link>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
