"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">Maîtrisez la méthode Schulich</h2>
          <p className="text-xl text-primary-foreground/80">
            Transformez votre processus de décision avec une méthode éprouvée et l'intelligence artificielle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button
                size="lg"
                variant="secondary"
                className="bg-accent hover:bg-accent/90"
              >
                Commencer la démo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Créer un compte gratuit
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
