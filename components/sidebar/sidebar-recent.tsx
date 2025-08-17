"use client"

import { ChevronRight, Clock, Edit3, FileText, History, MoreVertical, Pin, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Decision } from "@/types/decision"

interface SidebarRecentProps {
  decisions: Array<Partial<Decision> & { id?: string; isPinned?: boolean }>
  currentDecisionId?: string
  onDecisionSelect: (decisionId: string) => void
  onDecisionRename: (decisionId: string, newTitle: string) => void
  onDecisionDelete: (decisionId: string) => void
  onDecisionPin: (decisionId: string) => void
  onViewAll?: () => void
}

export const SidebarRecent = ({
  decisions,
  currentDecisionId,
  onDecisionSelect,
  onDecisionRename,
  onDecisionDelete,
  onDecisionPin,
  onViewAll
}: SidebarRecentProps) => {
  const [renamingDecision, setRenamingDecision] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")

  const formatDecisionTitle = (title: string | null | undefined) => {
    const safeTitle = title || "Décision sans titre"
    return safeTitle.length > 25 ? `${safeTitle.substring(0, 25)}...` : safeTitle
  }

  const handleRename = (decisionId: string, currentTitle: string) => {
    setRenamingDecision(decisionId)
    setRenameValue(currentTitle || "")
  }

  const handleRenameSubmit = (decisionId: string) => {
    if (renameValue.trim()) {
      onDecisionRename(decisionId, renameValue.trim())
    }
    setRenamingDecision(null)
    setRenameValue("")
  }

  const handleRenameCancel = () => {
    setRenamingDecision(null)
    setRenameValue("")
  }

  if (decisions.length === 0) {
    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-muted-foreground px-2 mb-3">Décisions récentes</h3>
        <div className="px-2 py-8 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">Aucune décision récente</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between px-2 mb-3">
        <h3 className="text-sm font-medium text-muted-foreground">Décisions récentes</h3>
        {decisions.length > 3 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Voir tout
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-1">
        {decisions.slice(0, 5).map((decision, index) => (
          <div
            key={decision.id || index}
            className={`
              group rounded-lg border transition-colors
              ${currentDecisionId === decision.id ? "bg-primary/5 border-primary/20" : "border-transparent hover:bg-muted/50"}
            `}
          >
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <button
                  type="button"
                  onClick={() => decision.id && onDecisionSelect(decision.id)}
                  className="flex-1 text-left min-w-0"
                >
                  {renamingDecision === decision.id ? (
                    <input
                      type="text"
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && decision.id) handleRenameSubmit(decision.id)
                        if (e.key === "Escape") handleRenameCancel()
                      }}
                      onBlur={() => decision.id && handleRenameSubmit(decision.id)}
                      className="w-full text-sm font-medium bg-background border rounded px-1 py-0.5"
                    />
                  ) : (
                    <h4 className="text-sm font-medium text-foreground truncate">{formatDecisionTitle(decision.title)}</h4>
                  )}

                  {decision.createdAt && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{new Date(decision.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                  )}
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => decision.id && handleRename(decision.id, decision.title || "")}>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Renommer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => decision.id && onDecisionPin(decision.id)}>
                      <Pin className="mr-2 h-4 w-4" />
                      {decision.isPinned ? "Désépingler" : "Épingler"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => decision.id && onDecisionDelete(decision.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>

      {decisions.length > 5 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <History className="mr-2 h-3 w-3" />
          Voir l'historique complet
        </Button>
      )}
    </div>
  )
}
