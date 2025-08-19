"use client"

import { useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentDecision } from "@/hooks/use-current-decision"
import { useDecisionActions } from "@/hooks/use-decision-actions"
import { useDecisionHistory } from "@/hooks/use-decision-queries"
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
  // ✅ API ZUSTAND PURE
  const { currentDecisionId, loadDecision, createNewDecision } = useCurrentDecision()

  // Use proper decision history hook instead of deprecated savedDecisions
  const { data: savedDecisions = [] } = useDecisionHistory(user)

  // Utiliser le hook centralisé pour les actions de décision
  const { handleDecisionRename: renameDecision, handleDecisionDelete: deleteDecision, handleDecisionPin: pinDecision } = useDecisionActions()

  // Calculation directe des décisions récentes au lieu d'un useEffect
  const decisions = useMemo(() => {
    const safeCount = Math.max(0, Math.min(10, savedDecisions.length))
    return savedDecisions.slice(0, safeCount)
  }, [savedDecisions])

  // Calculation directe du total des arguments au lieu d'un useEffect
  const totalArguments = useMemo(() => savedDecisions.reduce((total, d) => total + (d.arguments?.length || 0), 0), [savedDecisions])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const handleNewDecision = () => {
    // ✅ Utilise l'API Zustand au lieu de recharger la page
    createNewDecision()
  }

  const handleViewAll = () => {
    window.location.href = "/platform/history"
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
      {/* Header */}
      <SidebarHeader />

      {/* Actions ou Authentification */}
      {user ? <SidebarActions onNewDecision={handleNewDecision} /> : <SidebarAuth />}

      {/* Décisions récentes (si authentifié) */}
      {user && decisions.length > 0 && (
        <SidebarRecent
          decisions={decisions}
          currentDecisionId={currentDecisionId || undefined}
          onDecisionSelect={loadDecision}
          onDecisionRename={renameDecision}
          onDecisionDelete={deleteDecision}
          onDecisionPin={pinDecision}
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
