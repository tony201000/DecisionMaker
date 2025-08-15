"use client"

import type { User } from "@supabase/supabase-js"
import {
  LogIn,
  LogOut,
  Moon,
  Settings,
  Sun,
  UserIcon,
  UserPlus,
  X,
  FileText,
  History,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useDecision } from "@/hooks/use-decision"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function Sidebar({ isOpen, onToggle, isDarkMode, onToggleDarkMode }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { savedDecisions, loadDecision, currentDecision, getRecentDecisions } = useDecision()

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getSession()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase]) // Include memoized supabase in deps

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const getUserDisplayName = (user: User) => {
    if (user.user_metadata?.firstName) {
      return user.user_metadata.firstName
    }
    // Extract first part of email as fallback
    const emailName = user.email?.split("@")[0] || "Utilisateur"
    return emailName.charAt(0).toUpperCase() + emailName.slice(1)
  }

  const handleDecisionSelect = async (decisionId: string) => {
    await loadDecision(decisionId)
    onToggle() // Close sidebar on mobile after selection
  }

  const formatDecisionTitle = (title: string | null | undefined) => {
    const safeTitle = title || "Décision sans titre"
    return safeTitle.length > 25 ? `${safeTitle.substring(0, 25)}...` : safeTitle
  }

  const getRecommendationColor = (positiveScore: number, negativeScore: number) => {
    const ratio = negativeScore > 0 ? positiveScore / negativeScore : positiveScore > 0 ? Number.POSITIVE_INFINITY : 1
    if (ratio >= 2) return "text-green-600 dark:text-green-400"
    if (ratio <= 0.5) return "text-red-600 dark:text-red-400"
    return "text-orange-600 dark:text-orange-400"
  }

  const recentDecisions = getRecentDecisions(10)

  if (loading) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <button
            type="button"
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onToggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onToggle()
              }
            }}
            aria-label="Fermer le menu"
            tabIndex={0}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-gray-500 dark:text-gray-400">Chargement...</div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onToggle()
            }
          }}
          aria-label="Fermer le menu"
          tabIndex={0}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-80 bg-card shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* User Section */}
            {user ? (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">Bienvenue {getUserDisplayName(user)}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/login">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <UserPlus className="w-4 h-4 mr-2" />
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {/* Recent Decisions Section */}
            {user && recentDecisions && recentDecisions.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-card-foreground flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Décisions récentes
                    </h3>
                    <Link href="/app/history">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Tout voir
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {recentDecisions.map((decision) => {
                      const isActive = currentDecision?.id === decision.id
                      const argumentsArray = decision.arguments || []
                      const positiveScore = argumentsArray
                        .filter((arg) => arg?.weight > 0)
                        .reduce((sum, arg) => sum + (arg?.weight || 0), 0)
                      const negativeScore = Math.abs(
                        argumentsArray.filter((arg) => arg?.weight < 0).reduce((sum, arg) => sum + (arg?.weight || 0)),
                      )
                      const recommendation = getRecommendationColor(positiveScore, negativeScore)

                      return (
                        <button
                          key={decision.id}
                          onClick={() => handleDecisionSelect(decision.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-colors hover:bg-accent/50 ${
                            isActive
                              ? "bg-primary/10 border-primary/20"
                              : "bg-card border-border hover:border-border/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <p className="font-medium text-sm text-card-foreground truncate">
                                  {formatDecisionTitle(decision.title)}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs font-medium ${recommendation}`}>
                                  {recommendation === "text-green-600 dark:text-green-400"
                                    ? "Favorable"
                                    : recommendation === "text-red-600 dark:text-red-400"
                                      ? "Défavorable"
                                      : "Mitigé"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {positiveScore}:{negativeScore}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(decision.updated_at || decision.created_at).toLocaleDateString("fr-FR")}
                              </p>
                            </div>
                            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Settings */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Paramètres
                </h3>

                <div className="space-y-3">
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Mode sombre</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggleDarkMode}
                      className="w-10 h-10 p-0 bg-transparent"
                    >
                      {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats (if user is logged in) */}
            {user && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-card-foreground mb-3">Mes Statistiques</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Décisions prises</span>
                      <Badge variant="secondary">{savedDecisions?.length || 0}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Arguments ajoutés</span>
                      <Badge variant="secondary">
                        {(savedDecisions || []).reduce(
                          (total, decision) => total + (decision.arguments || []).length,
                          0,
                        )}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer */}
          {user && (
            <div className="p-4 border-t border-border">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
