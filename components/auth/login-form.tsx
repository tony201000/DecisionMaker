"use client"

import Link from "next/link"
import type React from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from "@/lib/actions/auth-actions"
import { cn } from "@/lib/utils"

async function loginWithErrorHandling(prevState: any, formData: FormData) {
  try {
    await loginAction(formData)
    return { error: null }
  } catch (error: unknown) {
    return { 
      error: error instanceof Error ? error.message : "Une erreur est survenue" 
    }
  }
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(loginWithErrorHandling, { error: null })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>
            Entrez votre email pour vous connecter à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@exemple.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              {state.error && (
                <p className="text-sm text-red-500">{state.error}</p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Connexion..." : "Se connecter"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Pas de compte ?{" "}
              <Link
                href="/sign-up"
                className="underline underline-offset-4"
              >
                S'inscrire
              </Link>
            </div>
            <div className="mt-2 text-center text-sm">
              <Link
                href="/forgot-password"
                className="underline underline-offset-4 text-muted-foreground"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}