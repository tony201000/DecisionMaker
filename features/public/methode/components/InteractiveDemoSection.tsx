"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function InteractiveDemoSection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-accent/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-card-foreground">Exemple Concret d'Analyse</CardTitle>
            <CardDescription>Découvrez comment la méthode s'applique à une décision réelle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-card rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">Décision : Lancer un nouveau produit</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-accent">Arguments Positifs (14 pts)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-accent/5 rounded">
                      <span className="text-sm">Opportunité de marché</span>
                      <span className="text-accent font-semibold">+8</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-accent/5 rounded">
                      <span className="text-sm">Équipe motivée</span>
                      <span className="text-accent font-semibold">+6</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-destructive">Arguments Négatifs (7 pts)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-destructive/5 rounded">
                      <span className="text-sm">Investissement élevé</span>
                      <span className="text-destructive font-semibold">-5</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-destructive/5 rounded">
                      <span className="text-sm">Risque concurrentiel</span>
                      <span className="text-destructive font-semibold">-2</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <p className="text-lg font-semibold text-accent mb-2">Recommandation : Favorable</p>
                <p className="text-sm text-muted-foreground">Ratio 2:1 respecté (14 vs 7) - La décision est recommandée</p>
              </div>
            </div>
            <div className="text-center">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90"
                >
                  Essayer avec vos propres données
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
