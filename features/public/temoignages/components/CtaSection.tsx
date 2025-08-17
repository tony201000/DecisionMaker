"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">Rejoignez nos clients satisfaits</h2>
          <p className="text-xl text-primary-foreground/80">Commencez dès aujourd'hui à transformer vos décisions avec DecisionAI.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button
                size="lg"
                variant="secondary"
                className="bg-accent hover:bg-accent/90"
              >
                Essayer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
