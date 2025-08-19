import { createClient } from "@/lib/supabase/client"
import type { Decision } from "@/types/decision"

export class DecisionService {
  private supabase = createClient()

  async getAllDecisions(userId: string): Promise<Decision[]> {
    const { data, error } = await this.supabase
      .from("decisions")
      .select(`
        *,
        arguments (*)
      `)
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      throw new Error(`Erreur lors du chargement des décisions: ${error.message}`)
    }

    return data || []
  }

  async getDecisionById(decisionId: string): Promise<Decision | null> {
    const { data, error } = await this.supabase
      .from("decisions")
      .select(`
        *,
        arguments (*)
      `)
      .eq("id", decisionId)
      .single()

    if (error) {
      throw new Error(`Erreur lors du chargement de la décision: ${error.message}`)
    }

    return data || null
  }
}
