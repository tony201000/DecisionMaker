import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/actions/auth-actions"

interface LogoutButtonProps {
  children?: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ children = "Se déconnecter", variant = "default", size = "default", className }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant={variant}
        size={size}
        className={className}
      >
        {children}
      </Button>
    </form>
  )
}
