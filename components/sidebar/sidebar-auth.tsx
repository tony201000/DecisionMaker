"use client"

import { LogIn, Play, UserPlus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SidebarAuthProps {
  onDemo?: () => void
}

export const SidebarAuth = ({ onDemo }: SidebarAuthProps) => {
  return (
    <div className="space-y-2">
      <Link
        href="/login"
        className="w-full"
      >
        <Button
          variant="outline"
          className="w-full justify-start"
        >
          <LogIn className="w-4 h-4 mr-2" /> Se connecter
        </Button>
      </Link>

      <Link
        href="/sign-up"
        className="w-full"
      >
        <Button
          variant="outline"
          className="w-full justify-start"
        >
          <UserPlus className="w-4 h-4 mr-2" /> S'inscrire
        </Button>
      </Link>

      {onDemo && (
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={onDemo}
        >
          <Play className="w-4 h-4 mr-2" /> Voir la démo
        </Button>
      )}
    </div>
  )
}
