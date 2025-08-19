"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CtaSectionProps {
  title: string
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

export function CtaSection({ title, description, primaryButton, secondaryButton }: CtaSectionProps) {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground">{title}</h2>
          <p className="text-xl text-primary-foreground/80">{description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={primaryButton.href}>
              <Button
                size="lg"
                variant="secondary"
                className="bg-accent hover:bg-accent/90"
              >
                {primaryButton.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href={secondaryButton.href}>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
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
