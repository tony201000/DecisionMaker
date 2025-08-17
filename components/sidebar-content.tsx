"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { SidebarActions, SidebarAuth, SidebarHeader, SidebarRecent, SidebarStats, SidebarUser } from "@/components/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { useCurrentDecision } from "@/hooks/use-current-decision"
import { useDecisionHistory, useDeleteDecision, usePinDecision, useRenameDecision } from "@/hooks/use-decision-queries"
import { createClient } from "@/lib/supabase/client"

export function SidebarContent() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = useMemo(() => createClient(), [])

  // Use new unified architecture
  const { data: savedDecisions = [] } = useDecisionHistory(user)
  const { mutate: deleteDecision } = useDeleteDecision()
  const { mutate: renameDecision } = useRenameDecision()
  const { mutate: pinDecision } = usePinDecision()

  // Use unified current decision hook
  const { currentDecision, loadDecision } = useCurrentDecision()

  const isAuthenticated = !!user
  const decisions = savedDecisions.slice(0, 10)
  const totalArguments = (savedDecisions || []).reduce((total, d) => total + (d.arguments?.length || 0), 0)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleNewDecision = () => {
    router.push("/platform")
  }

  const handleDecisionSelect = async (decisionId: string) => {
    await loadDecision(decisionId)
  }

  const handleDecisionRename = async (decisionId: string, newTitle: string) => {
    renameDecision({ decisionId, newTitle, user })
  }

  const handleDecisionDelete = async (decisionId: string) => {
    deleteDecision({ decisionId, user })
  }

  const handleDecisionPin = async (decisionId: string) => {
    pinDecision({ decisionId, user })
  }

  const handleViewAll = () => {
    router.push("/platform/history")
  }

  return (
    <div className="flex flex-col h-full p-4 bg-card text-card-foreground">
      <SidebarHeader />
      <div className="flex-1 overflow-y-auto mt-4">
        {isAuthenticated ? (
          <>
            <SidebarActions
              isDarkMode={false} // Gérer le mode sombre si nécessaire
              onToggleDarkMode={() => {}}
              onNewDecision={handleNewDecision}
            />
            <SidebarRecent
              decisions={decisions}
              currentDecisionId={currentDecision?.id}
              onDecisionSelect={handleDecisionSelect}
              onDecisionRename={handleDecisionRename}
              onDecisionDelete={handleDecisionDelete}
              onDecisionPin={handleDecisionPin}
              onViewAll={handleViewAll}
            />
            <SidebarStats
              totalDecisions={savedDecisions?.length || 0}
              totalArguments={totalArguments}
              thisWeekDecisions={0} // Calculer si nécessaire
            />
          </>
        ) : (
          <div className="mt-8">
            <SidebarAuth />
          </div>
        )}
      </div>
      {isAuthenticated && (
        <div className="mt-auto">
          <SidebarUser
            user={user}
            onLogout={handleLogout}
            onOpenProfile={() => router.push("/platform")}
            onOpenSettings={() => router.push("/platform")}
          />
        </div>
      )}
    </div>
  )
}
