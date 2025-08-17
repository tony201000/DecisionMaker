"use client"

import type { User } from "@supabase/supabase-js"
import { LogOut, Settings, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SidebarUserProps {
  user: User | null
  onLogout: () => void
  onOpenProfile?: () => void
  onOpenSettings?: () => void
}

const getUserDisplayName = (user: User) => {
  const firstName = (user.user_metadata as Record<string, unknown> | undefined)?.firstName as string | undefined
  if (firstName) return firstName
  const emailName = user.email?.split("@")[0] || "Utilisateur"
  return emailName.charAt(0).toUpperCase() + emailName.slice(1)
}

export const SidebarUser = ({ user, onLogout, onOpenProfile, onOpenSettings }: SidebarUserProps) => {
  if (!user) return null

  const displayName = getUserDisplayName(user)

  return (
    <div className="mt-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate">{displayName}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56"
        >
          <DropdownMenuItem
            onClick={onOpenProfile}
            className="cursor-pointer"
          >
            <UserIcon className="w-4 h-4 mr-2" /> Profil
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenSettings}
            className="cursor-pointer"
          >
            <Settings className="w-4 h-4 mr-2" /> Réglages
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onLogout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" /> Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
