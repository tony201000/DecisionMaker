"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  title: string | React.ReactNode
  description: string
  primaryButton: {
    text: string
    href: string
  }
  secondaryButton: {
    text: string
    href: string
  }
}

export function HeroSection({ title, description, primaryButton, secondaryButton }: HeroSectionProps) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={primaryButton.href}>
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90"
              >
                {primaryButton.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href={secondaryButton.href}>
              <Button
                variant="outline"
                size="lg"
              >
                {secondaryButton.text}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
