import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { principles } from "../data"

export function PrinciplesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Principes Fondamentaux</h2>
          <p className="text-xl text-muted-foreground">Les règles qui garantissent la qualité de vos décisions</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {principles.map(principle => (
            <Card
              key={principle.title}
              className="border-border/50 hover:border-accent/50 transition-colors"
            >
              <CardHeader>
                <CardTitle className="text-xl text-card-foreground">{principle.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{principle.description}</p>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm text-accent font-medium">Exemple :</p>
                  <p className="text-sm text-muted-foreground mt-1">{principle.example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
