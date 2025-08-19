"use client"

import { ArrowRight } from "lucide-react"
import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  outline: "border border-input hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
} as const

const sizes = {
  default: "h-10 py-2 px-4",
  lg: "h-11 px-8 rounded-md",
  sm: "h-9 px-3 rounded-md"
} as const

// Composant SimpleButton réutilisé depuis la page originale
function SimpleButton({
  children,
  variant = "default",
  size = "default",
  className = "",
  href,
  ...props
}: {
  children: ReactNode
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  className?: string
  href?: string
  [key: string]: unknown
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

export function ShareExperienceSection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
          <div className="p-6 text-center">
            <h3 className="text-2xl font-semibold text-card-foreground mb-2">Partagez votre expérience</h3>
            <p className="text-muted-foreground mb-6">Votre retour nous aide à améliorer continuellement notre plateforme</p>
          </div>
          <div className="px-6 pb-6 text-center space-y-6">
            <p className="text-muted-foreground">
              Vous utilisez déjà DecisionAI ? Partagez votre expérience avec notre communauté et aidez d'autres professionnels à découvrir les
              bénéfices de notre solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SimpleButton
                size="lg"
                className="bg-accent hover:bg-accent/90"
              >
                Laisser un témoignage
                <ArrowRight className="w-5 h-5 ml-2" />
              </SimpleButton>
              <SimpleButton
                variant="outline"
                size="lg"
              >
                Contacter le support
              </SimpleButton>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
