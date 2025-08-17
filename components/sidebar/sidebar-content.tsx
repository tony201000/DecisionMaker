"use client"

import { useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useDecision } from "@/hooks/use-decision"
import { createClient } from "@/lib/supabase/client"
import { SidebarActions } from "./sidebar-actions"
import { SidebarAuth } from "./sidebar-auth"
import { SidebarHeader } from "./sidebar-header"
import { SidebarRecent } from "./sidebar-recent"
import { SidebarStats } from "./sidebar-stats"
import { SidebarUser } from "./sidebar-user"

/**
 * Contenu par défaut de la sidebar - Compose automatiquement les modules
 * selon l'état d'authentification de l'utilisateur
 */
export function SidebarContent() {
  const { user } = useAuth()
  const { savedDecisions, getRecentDecisions, currentDecision, loadDecision, deleteDecision, renameDecision, pinDecision, loadDecisionHistory } =
    useDecision()

  // Calculation directe des décisions récentes au lieu d'un useEffect
  const decisions = useMemo(() => getRecentDecisions(10), [getRecentDecisions])

  // Calculation directe du total des arguments au lieu d'un useEffect
  const totalArguments = useMemo(() => (savedDecisions || []).reduce((total, d) => total + (d.arguments?.length || 0), 0), [savedDecisions])

  // Chargement automatique de l'historique quand l'utilisateur change
  // Utilisation de useMemo au lieu de useEffect pour éviter les re-renders inutiles
  useMemo(() => {
    if (user && savedDecisions.length === 0) {
      loadDecisionHistory(user)
    }
  }, [user, savedDecisions.length, loadDecisionHistory])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const handleNewDecision = () => {
    window.location.href = "/platform"
  }

  const handleViewAll = () => {
    window.location.href = "/platform/history"
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
      {/* Header */}
      <SidebarHeader />

      {/* Actions ou Authentification */}
      {user ? (
        <SidebarActions
          isDarkMode={false} // TODO: Récupérer depuis le contexte theme
          onToggleDarkMode={() => {}} // TODO: Implémenter
          onNewDecision={handleNewDecision}
        />
      ) : (
        <SidebarAuth />
      )}

      {/* Décisions récentes (si authentifié) */}
      {user && decisions.length > 0 && (
        <SidebarRecent
          decisions={decisions}
          currentDecisionId={currentDecision?.id}
          onDecisionSelect={id => loadDecision(id)}
          onDecisionRename={(id, title) => user && renameDecision(user, id, title)}
          onDecisionDelete={id => user && deleteDecision(user, id)}
          onDecisionPin={id => user && pinDecision(user, id)}
          onViewAll={handleViewAll}
        />
      )}

      {/* Statistiques (si authentifié) */}
      {user && (
        <SidebarStats
          totalDecisions={savedDecisions?.length || 0}
          totalArguments={totalArguments}
          thisWeekDecisions={0} // TODO: Calculer depuis les données
        />
      )}

      {/* User info en bas (si authentifié) */}
      {user && (
        <div className="mt-auto">
          <SidebarUser
            user={user}
            onLogout={handleLogout}
          />
        </div>
      )}
    </div>
  )
}
