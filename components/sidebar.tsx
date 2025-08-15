"use client"

import type { User } from "@supabase/supabase-js"
import {
  ChevronRight,
  Edit3,
  FileText,
  History,
  LogIn,
  LogOut,
  Moon,
  MoreVertical,
  Pin,
  Settings,
  Sun,
  Trash2,
  UserIcon,
  UserPlus,
  X
} from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useDecision } from "@/hooks/use-decision"
import { createClient } from "@/lib/supabase/client"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  onLoadDecision?: (decisionId: string) => Promise<void>
}

export function Sidebar({ isOpen, onToggle, isDarkMode, onToggleDarkMode, onLoadDecision }: SidebarProps) {
  const { user } = useAuth()
  const [renamingDecision, setRenamingDecision] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const { savedDecisions, loadDecision, currentDecision, getRecentDecisions, loadDecisionHistory, deleteDecision, renameDecision, pinDecision } =
    useDecision()

  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadDecisionHistory(user)
    }
  }, [user, loadDecisionHistory])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const getUserDisplayName = (user: User) => {
    if (user.user_metadata?.firstName) {
      return user.user_metadata.firstName
    }
    const emailName = user.email?.split("@")[0] || "Utilisateur"
    return emailName.charAt(0).toUpperCase() + emailName.slice(1)
  }

  const handleDecisionSelect = async (decisionId: string) => {
    if (onLoadDecision) {
      await onLoadDecision(decisionId)
    } else {
      await loadDecision(decisionId)
    }
    onToggle()
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

  const handleDeleteDecision = async (decisionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Êtes-vous sûr de vouloir supprimer cette décision ?")) {
      await deleteDecision(user, decisionId)
    }
  }

  const handleRenameDecision = (decisionId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setRenamingDecision(decisionId)
    setRenameValue(currentTitle)
  }

  const handleRenameSubmit = async (decisionId: string) => {
    if (renameValue.trim()) {
      await renameDecision(user, decisionId, renameValue.trim())
    }
    setRenamingDecision(null)
    setRenameValue("")
  }

  const handlePinDecision = async (decisionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await pinDecision(user, decisionId)
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              onToggle()
            }
          }}
          aria-label="Fermer le menu"
          tabIndex={0}
        />
      )}

      <div
        className={`
        fixed top-0 left-0 h-full w-80 bg-card shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
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
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {user && recentDecisions && recentDecisions.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-card-foreground flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Décisions récentes
                    </h3>
                    <Link href="/app/history">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                      >
                        Tout voir
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {recentDecisions.map(decision => {
                      const isActive = currentDecision?.id === decision.id
                      const argumentsArray = decision.arguments || []
                      const positiveScore = argumentsArray.filter(arg => arg?.weight > 0).reduce((sum, arg) => sum + (arg?.weight || 0), 0)
                      const negativeScore = Math.abs(argumentsArray.filter(arg => arg?.weight < 0).reduce((sum, arg) => sum + (arg?.weight || 0), 0))
                      const recommendation = getRecommendationColor(positiveScore, negativeScore)

                      return (
                        <div
                          key={decision.id}
                          className={`group relative w-full rounded-lg border transition-colors hover:bg-accent/50 ${
                            isActive ? "bg-primary/10 border-primary/20" : "bg-card border-border hover:border-border/60"
                          }`}
                        >
                          {renamingDecision === decision.id ? (
                            <div className="p-3">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={e => setRenameValue(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === "Enter" && decision.id) {
                                    handleRenameSubmit(decision.id)
                                  } else if (e.key === "Escape") {
                                    setRenamingDecision(null)
                                  }
                                }}
                                onBlur={() => {
                                  if (decision.id) {
                                    handleRenameSubmit(decision.id)
                                  }
                                }}
                                className="w-full px-2 py-1 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => decision.id && handleDecisionSelect(decision.id)}
                                className="w-full text-left p-3 rounded-lg"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                      <p className="font-medium text-sm text-card-foreground truncate">{formatDecisionTitle(decision.title)}</p>
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
                                      {(() => {
                                        const ts = decision.createdAt || ""
                                        if (!ts) return "—"
                                        const d = new Date(ts)
                                        return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("fr-FR")
                                      })()}
                                    </p>
                                  </div>
                                  <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                </div>
                              </button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={e => e.stopPropagation()}
                                  >
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40"
                                >
                                  <DropdownMenuItem
                                    onClick={e => {
                                      console.log("Pin dropdown clicked", decision, decision.id)
                                      if (decision.id) {
                                        handlePinDecision(decision.id, e)
                                      } else {
                                        console.error("Decision ID is missing for pin action")
                                      }
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Pin className="w-3 h-3 mr-2" />
                                    Épingler
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={e => {
                                      console.log("Rename dropdown clicked", decision, decision.id, decision.title)
                                      if (decision.id) {
                                        handleRenameDecision(decision.id, decision.title || "", e)
                                      } else {
                                        console.error("Decision ID is missing for rename action")
                                      }
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3 mr-2" />
                                    Renommer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={e => {
                                      console.log("Delete dropdown clicked", decision, decision.id)
                                      if (decision.id) {
                                        handleDeleteDecision(decision.id, e)
                                      } else {
                                        console.error("Decision ID is missing for delete action")
                                      }
                                    }}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-card-foreground mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Paramètres
                </h3>

                <div className="space-y-3">
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
                        {(savedDecisions || []).reduce((total, decision) => total + (decision.arguments || []).length, 0)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

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
