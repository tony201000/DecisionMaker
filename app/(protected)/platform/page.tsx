import { redirect } from "next/navigation"
import { DecisionPlatform } from "@/features/platform/DecisionPlatform"
import { createClient } from "@/lib/supabase/server"

export default async function PlatformPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }

  return <DecisionPlatform user={data.user} />
}
