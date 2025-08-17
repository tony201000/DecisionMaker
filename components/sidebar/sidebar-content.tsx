"use client"

import { useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentDecision } from "@/hooks/use-current-decision"
import { useDecisionHistory, useDeleteDecision, usePinDecision, useRenameDecision } from "@/hooks/use-decision-queries"
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
  const { currentDecision, loadDecision } = useCurrentDecision()

  // Use proper decision history hook instead of deprecated savedDecisions
  const { data: savedDecisions = [] } = useDecisionHistory(user)

  // React Query mutations for decision operations
  const deleteDecisionMutation = useDeleteDecision()
  const renameDecisionMutation = useRenameDecision()
  const pinDecisionMutation = usePinDecision()

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
    window.location.href = "/platform"
  }

  const handleViewAll = () => {
    window.location.href = "/platform/history"
  }

  const handleDecisionRename = (id: string, title: string) => {
    if (user) {
      renameDecisionMutation.mutate({ decisionId: id, newTitle: title, user })
    }
  }

  const handleDecisionDelete = (id: string) => {
    if (user) {
      deleteDecisionMutation.mutate({ decisionId: id, user })
    }
  }

  const handleDecisionPin = (id: string) => {
    if (user) {
      pinDecisionMutation.mutate({ decisionId: id, user })
    }
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
          onDecisionSelect={loadDecision}
          onDecisionRename={handleDecisionRename}
          onDecisionDelete={handleDecisionDelete}
          onDecisionPin={handleDecisionPin}
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
