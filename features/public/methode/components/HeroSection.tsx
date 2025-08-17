"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
            La Méthode <span className="text-primary">Schulich</span> Enrichie par l'IA
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Découvrez comment notre plateforme s'appuie sur la méthode éprouvée de Seymour Schulich, enrichie par l'intelligence artificielle pour
            vous aider à prendre des décisions plus éclairées.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                Voir la méthode en action
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/fonctionnalites">
              <Button
                variant="outline"
                size="lg"
              >
                Découvrir les fonctionnalités
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
