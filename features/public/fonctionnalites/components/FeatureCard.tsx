import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  feature: {
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    highlight?: string
    benefits: string[]
  }
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card className="relative group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-accent/50">
      {feature.highlight && (
        <div className="absolute -top-3 left-6 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
          {feature.highlight}
        </div>
      )}
      <CardHeader className="space-y-4">
        <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
          <feature.icon className="w-8 h-8 text-accent" />
        </div>
        <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
        <ul className="space-y-2">
          {feature.benefits.map(benefit => (
            <li
              key={benefit}
              className="flex items-center text-sm text-muted-foreground"
            >
              <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3" />
              {benefit}
            </li>
          ))}
        </ul>
        <Button
          variant="ghost"
          className="w-full group-hover:bg-accent/10 transition-colors"
        >
          En savoir plus
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  )
}
