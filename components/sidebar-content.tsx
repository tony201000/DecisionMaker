"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useDecision } from "@/hooks/use-decision"
import { createClient } from "@/lib/supabase/client"
import {
  SidebarActions,
  SidebarAuth,
  SidebarHeader,
  SidebarRecent,
  SidebarStats,
  SidebarUser,
} from "@/components/sidebar"

export function SidebarContent() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = useMemo(() => createClient(), [])
  const {
    savedDecisions,
    getRecentDecisions,
    currentDecision,
    loadDecision,
    deleteDecision,
    renameDecision,
    pinDecision,
  } = useDecision()

  const isAuthenticated = !!user
  const decisions = getRecentDecisions(10)
  const totalArguments = (savedDecisions || []).reduce(
    (total, d) => total + (d.arguments?.length || 0),
    0
  )

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
    await renameDecision(user, decisionId, newTitle)
  }

  const handleDecisionDelete = async (decisionId: string) => {
    await deleteDecision(user, decisionId)
  }

  const handleDecisionPin = async (decisionId: string) => {
    await pinDecision(user, decisionId)
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
