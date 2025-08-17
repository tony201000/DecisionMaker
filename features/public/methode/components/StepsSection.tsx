import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { steps } from "../data"

export function StepsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">4 Étapes Simples</h2>
          <p className="text-xl text-muted-foreground">Un processus structuré pour des décisions éclairées</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-accent to-transparent z-0" />
              )}
              <Card className="relative z-10 h-full hover:shadow-lg transition-shadow border-border/50 hover:border-accent/50">
                <CardHeader className="text-center space-y-4">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-2xl font-bold mx-auto">
                    {step.number}
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto text-accent">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl text-card-foreground">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-muted-foreground text-center">{step.description}</CardDescription>
                  <ul className="space-y-2">
                    {step.details.map(detail => (
                      <li
                        key={detail}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <CheckCircle className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
