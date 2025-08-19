import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import React from "react"
import "./globals.css"
import ErrorBoundary from "@/components/layout/error-boundary"
import { ToastProvider } from "@/hooks/use-toast"
import { AppQueryProvider } from "@/lib/providers/app-query-provider"
import ThemeProvider from "@/lib/providers/theme-provider"

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter"
})

const spaceGrotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-space-grotesk"
})

export const metadata: Metadata = {
  description:
    "Prenez des décisions éclairées avec l'IA. Méthode Schulich enrichie par l'intelligence artificielle pour analyser vos arguments et optimiser vos choix.",
  generator: "v0.app",
  title: "DecisionAI - Plateforme d'Aide à la Décision"
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="transition-colors duration-300">
        <React.StrictMode>
          <ErrorBoundary>
            <AppQueryProvider>
              <ToastProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </ToastProvider>
            </AppQueryProvider>
          </ErrorBoundary>
        </React.StrictMode>
      </body>
    </html>
  )
}
