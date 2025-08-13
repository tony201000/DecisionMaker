"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, UserIcon, LogIn, LogOut, Settings, Moon, Sun, UserPlus } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export function Sidebar({ isOpen, onToggle, isDarkMode, onToggleDarkMode }: SidebarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
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
  }, [])

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

  if (loading) {
    return (
      <>
        {/* Overlay */}
        {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />}

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
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onToggle} />}

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
          <div className="flex-1 p-4 space-y-4">
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
                      <Badge variant="secondary">0</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Arguments ajoutés</span>
                      <Badge variant="secondary">0</Badge>
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
