import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import type { AISuggestion, Argument, Decision } from "@/types/decision"
import { NewDecisionSchema, ArgumentSchema } from "@/features/decision/schemas"
import * as z from "zod"

// Type pour la réponse de Supabase
interface SupabaseDecision {
  id: string
  title: string | null
  description: string | null
  created_at: string | null
  updated_at: string | null
  arguments: Array<{
    text: string
    weight: number
  }> | null
}

export class DecisionCrudService {
  private supabase = createClient()

  async loadDecisionHistory(user: User | null): Promise<Decision[]> {
    if (!user) return []

    try {
      const { data: decisions, error } = await this.supabase
        .from("decisions")
        .select(`
          id,
          title,
          description,
          created_at,
          updated_at,
          arguments (
            text,
            weight
          )
        `)
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error

      // Transform the data to match our Decision type
      const transformedDecisions = (decisions || []).map((decision: SupabaseDecision) => ({
        arguments: decision.arguments || [],
        createdAt: decision.created_at ? new Date(decision.created_at) : new Date(),
        description: decision.description || "",
        id: decision.id,
        title: decision.title || "Décision sans titre",
        updatedAt: decision.updated_at ? new Date(decision.updated_at) : new Date()
      }))

      return transformedDecisions
    } catch (error) {
      console.error("Error loading decision history:", error)
      throw error
    }
  }

  async loadDecisionById(decisionId: string): Promise<Decision | null> {
    try {
      const { data, error } = await this.supabase
        .from("decisions")
        .select(`
          id,
          title,
          description,
          created_at,
          updated_at,
          arguments (
            text,
            weight
          )
        `)
        .eq("id", decisionId)
        .single()

      if (error) {
        console.error("Error loading decision by ID:", error)
        return null
      }

      if (!data) {
        console.error("Decision not found:", decisionId)
        return null
      }

      return {
        arguments: data.arguments || [],
        createdAt: data.created_at ? new Date(data.created_at) : new Date(),
        description: data.description || "",
        id: data.id,
        title: data.title || "Décision sans titre",
        updatedAt: data.updated_at ? new Date(data.updated_at) : new Date()
      }
    } catch (error) {
      console.error("Error in loadDecisionById:", error)
      return null
    }
  }

  async saveDecision(user: User | null, decision: Omit<Decision, "id" | "createdAt" | "updatedAt">, args: Argument[]): Promise<Decision | null> {
    if (!user) {
      throw new Error("User is required to save a decision")
    }

    // ✅ VALIDATION ZOD - Remplace la validation manuelle
    try {
      const validatedDecision = NewDecisionSchema.parse({
        title: decision.title,
        description: decision.description
      })
      
      const validatedArgs = z.array(ArgumentSchema.omit({ id: true, createdAt: true, updatedAt: true })).parse(args)
      
      // Save decision avec les données validées
      const { data: decisionData, error: decisionError } = await this.supabase
        .from("decisions")
        .insert({
          description: validatedDecision.description,
          title: validatedDecision.title,
          user_id: user.id
        })
        .select()
        .single()

      if (decisionError) throw decisionError

      // Save arguments avec validation Zod
      if (validatedArgs.length > 0) {
        const argumentsToInsert = validatedArgs.map(arg => ({
          decision_id: decisionData.id,
          text: arg.text,
          weight: arg.weight
        }))

        const { error: argumentsError } = await this.supabase.from("arguments").insert(argumentsToInsert)
        if (argumentsError) throw argumentsError
      }

      return {
        arguments: validatedArgs.map((arg, index) => ({
          ...arg,
          id: `temp-${decisionData.id}-${index}`, // ID temporaire pour les nouveaux arguments
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        createdAt: new Date(),
        description: validatedDecision.description,
        id: decisionData.id,
        title: validatedDecision.title,
        updatedAt: new Date()
      }
    } catch (error) {
      console.error("Error saving decision:", error)
      throw error
    }
  }

  async updateDecision(user: User | null, decision: Decision, args: Argument[]): Promise<Decision | null> {
    if (!user || !decision.id) {
      throw new Error("User and decision ID are required to update a decision")
    }

    if (!decision.title.trim()) {
      throw new Error("Title is required")
    }

    try {
      // Update decision
      const { data: decisionData, error: decisionError } = await this.supabase
        .from("decisions")
        .update({
          description: decision.description,
          title: decision.title,
          updated_at: new Date().toISOString()
        })
        .eq("id", decision.id)
        .select()
        .single()

      if (decisionError) throw decisionError

      // Delete existing arguments and insert new ones
      await this.supabase.from("arguments").delete().eq("decision_id", decision.id)

      if (args.length > 0) {
        const argumentsToInsert = args.map(arg => ({
          decision_id: decision.id,
          text: arg.text,
          weight: arg.weight
        }))

        const { error: argumentsError } = await this.supabase.from("arguments").insert(argumentsToInsert)
        if (argumentsError) throw argumentsError
      }

      return {
        arguments: args,
        createdAt: decision.createdAt,
        description: decision.description,
        id: decisionData.id,
        title: decision.title,
        updatedAt: new Date()
      }
    } catch (error) {
      console.error("Error updating decision:", error)
      throw error
    }
  }

  async deleteDecision(user: User | null, decisionId: string): Promise<void> {
    if (!user) {
      throw new Error("User is required to delete a decision")
    }

    try {
      // Delete arguments first (foreign key constraint)
      const { error: argsError } = await this.supabase.from("arguments").delete().eq("decision_id", decisionId)
      if (argsError) {
        console.error("Error deleting arguments:", argsError)
      }

      // Delete decision
      const { error } = await this.supabase.from("decisions").delete().eq("id", decisionId)
      if (error) {
        console.error("Error deleting decision:", error)
        throw error
      }
    } catch (error) {
      console.error("Error deleting decision:", error)
      throw error
    }
  }

  async renameDecision(user: User | null, decisionId: string, newTitle: string): Promise<void> {
    if (!user) {
      throw new Error("User is required to rename a decision")
    }

    // ✅ VALIDATION ZOD - Remplace la validation manuelle trim()
    const titleSchema = z.string().min(1, "Le titre est requis").max(100, "Le titre ne peut pas dépasser 100 caractères")
    const validatedTitle = titleSchema.parse(newTitle.trim())

    try {
      const { error } = await this.supabase
        .from("decisions")
        .update({
          title: validatedTitle,
          updated_at: new Date().toISOString()
        })
        .eq("id", decisionId)

      if (error) {
        console.error("Error updating decision:", error)
        throw error
      }
    } catch (error) {
      console.error("Error renaming decision:", error)
      throw error
    }
  }

  async pinDecision(user: User | null, decisionId: string): Promise<void> {
    if (!user) {
      throw new Error("User is required to pin a decision")
    }

    try {
      // Update the decision with current timestamp to move it to top
      const { error } = await this.supabase.from("decisions").update({ updated_at: new Date().toISOString() }).eq("id", decisionId)

      if (error) {
        console.error("Error updating decision:", error)
        throw error
      }
    } catch (error) {
      console.error("Error pinning decision:", error)
      throw error
    }
  }

  async generateSuggestions(decision: Pick<Decision, "title" | "description">, args: Argument[]): Promise<AISuggestion[]> {
    if (!decision.title.trim()) {
      throw new Error("Title is required to generate suggestions")
    }

    try {
      const response = await fetch("/api/suggest-arguments", {
        body: JSON.stringify({
          description: decision.description,
          existingArguments: args,
          title: decision.title
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      })

      if (!response.ok) {
        throw new Error("Failed to generate suggestions")
      }

      const data = await response.json()
      return data.suggestions || []
    } catch (error) {
      console.error("Error generating suggestions:", error)
      throw error
    }
  }
}
