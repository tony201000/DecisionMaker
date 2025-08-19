"use client"

import { Edit3, MoreVertical, Pin, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDecisionActions } from "@/hooks/use-decision-actions"
import type { Decision } from "@/types/decision"

interface DecisionActionsMenuProps {
  decision: Decision
  onDecisionUpdated?: () => void
  className?: string
  size?: "sm" | "default"
  variant?: "ghost" | "outline" | "default"
}

export const DecisionActionsMenu = ({ decision, onDecisionUpdated, className = "", size = "sm", variant = "ghost" }: DecisionActionsMenuProps) => {
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(decision.title || "")

  // Utiliser le hook centralisé pour les actions de décision
  const {
    handleDecisionRenameAsync,
    handleDecisionDeleteAsync,
    handleDecisionPinAsync,
    isDeleting,
    isRenaming: isMutationRenaming,
    isPinning
  } = useDecisionActions()

  const handleRename = () => {
    setIsRenaming(true)
    setRenameValue(decision.title || "")
  }

  const handleRenameSubmit = async () => {
    if (decision.id && renameValue.trim()) {
      try {
        await handleDecisionRenameAsync(decision.id, renameValue.trim())
        onDecisionUpdated?.()
      } catch (error) {
        console.error("Erreur lors du renommage:", error)
      }
    }
    setIsRenaming(false)
    setRenameValue("")
  }

  const handleRenameCancel = () => {
    setIsRenaming(false)
    setRenameValue("")
  }

  const handleDelete = async () => {
    if (decision.id && confirm(`Êtes-vous sûr de vouloir supprimer "${decision.title}" ?`)) {
      try {
        await handleDecisionDeleteAsync(decision.id)
        onDecisionUpdated?.()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const handlePin = async () => {
    if (decision.id) {
      try {
        await handleDecisionPinAsync(decision.id)
        onDecisionUpdated?.()
      } catch (error) {
        console.error("Erreur lors de l'épinglage:", error)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit()
    } else if (e.key === "Escape") {
      handleRenameCancel()
    }
  }

  // Si on est en mode renommage, afficher l'input
  if (isRenaming) {
    return (
      <input
        type="text"
        value={renameValue}
        onChange={e => setRenameValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleRenameSubmit}
        className="flex-1 min-w-0 text-sm font-medium bg-background border rounded px-2 py-1"
        // biome-ignore lint/a11y/noAutofocus: Input appears on user action
        autoFocus
      />
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`h-8 w-8 p-0 ${className}`}
          onClick={e => e.stopPropagation()} // Empêcher la propagation du clic
          disabled={isMutationRenaming || isDeleting || isPinning}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">{isMutationRenaming || isDeleting || isPinning ? "Action en cours..." : "Ouvrir le menu"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onClick={e => e.stopPropagation()}
      >
        <DropdownMenuItem
          onClick={handleRename}
          disabled={isMutationRenaming || isDeleting || isPinning}
        >
          <Edit3 className="mr-2 h-4 w-4" />
          {isMutationRenaming ? "Renommage..." : "Renommer"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handlePin}
          disabled={isMutationRenaming || isDeleting || isPinning}
        >
          <Pin className="mr-2 h-4 w-4" />
          {isPinning ? (decision.isPinned ? "Désépinglage..." : "Épinglage...") : decision.isPinned ? "Désépingler" : "Épingler"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
          disabled={isMutationRenaming || isDeleting || isPinning}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? "Suppression..." : "Supprimer"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
