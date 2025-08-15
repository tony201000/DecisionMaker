import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import type React from "react"
import "../globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "Témoignages - DecisionAI",
  description:
    "Découvrez ce que nos clients disent de DecisionAI et comment notre plateforme transforme leur prise de décision.",
}

export default function TestimonialsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
      <body className="transition-colors duration-300">{children}</body>
    </html>
  )
}
