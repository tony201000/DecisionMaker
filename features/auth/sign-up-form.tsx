"use client"

import Link from "next/link"
import type React from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpAction } from "@/lib/actions/auth-actions"
import { cn } from "@/lib/utils/decision-styles"

async function signUpWithErrorHandling(_prevState: any, formData: FormData) {
  const password = formData.get("password") as string
  const repeatPassword = formData.get("repeatPassword") as string

  if (password !== repeatPassword) {
    return { error: "Les mots de passe ne correspondent pas" }
  }

  try {
    await signUpAction(formData)
    return { error: null }
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue"
    }
  }
}

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(signUpWithErrorHandling, { error: null })

  return (
    <div
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>Entrez votre email pour créer votre compte</CardDescription>
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
              <div className="grid gap-2">
                <Label htmlFor="repeatPassword">Confirmer le mot de passe</Label>
                <Input
                  id="repeatPassword"
                  name="repeatPassword"
                  type="password"
                  required
                />
              </div>
              {state.error && <p className="text-sm text-red-500">{state.error}</p>}
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Création..." : "Créer un compte"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Déjà un compte ?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4"
              >
                Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
