"use client"

import type { User } from "@supabase/supabase-js"
import { useCallback, useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import type { AISuggestion, Argument, Decision } from "@/types/decision"

export function useDecision() {
  const [currentDecision, setCurrentDecision] = useState<Decision>({
    arguments: [],
    createdAt: new Date(),
    description: "",
    title: "Nouvelle décision",
    updatedAt: new Date()
  })
  const [saving, setSaving] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Array<AISuggestion>>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [savedDecisions, setSavedDecisions] = useState<Decision[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const supabase = useMemo(() => createClient(), [])
  const { addToast } = useToast()

  const loadDecisionHistory = useCallback(
    async (user: User | null) => {
      if (!user) return

      setLoadingHistory(true)
      try {
        const { data: decisions, error } = await supabase
          .from("decisions")
          .select(`
          id,
          title,
          description,
          created_at,
          arguments (
            text,
            weight
          )
        `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        // Transform the data to match our Decision type
        const transformedDecisions = (decisions || []).map(
          (decision: {
            id: string
            title: string
            description?: string
            created_at: string
            updated_at?: string
            arguments: Array<{ text: string; weight: number }>
          }) => ({
            arguments: decision.arguments || [],
            createdAt: decision.created_at ? new Date(decision.created_at) : new Date(),
            description: decision.description || "",
            id: decision.id, // Ensure id is always present
            title: decision.title || "Décision sans titre",
            updatedAt: decision.updated_at ? new Date(decision.updated_at) : new Date()
          })
        )

        setSavedDecisions(transformedDecisions)
      } catch (error) {
        console.error("Error loading decision history:", error)
        addToast({
          description: "Erreur lors du chargement de l'historique",
          title: "Erreur",
          variant: "destructive"
        })
      } finally {
        setLoadingHistory(false)
      }
    },
    [supabase, addToast]
  )

  const loadDecision = async (decisionIdOrObject: string | Decision, setArgs?: (args: Argument[]) => void) => {
    try {
      let savedDecision: Decision

      // Handle both ID string and Decision object
      if (typeof decisionIdOrObject === "string") {
        const decisionId = decisionIdOrObject

        // First try to find in savedDecisions cache
        const cachedDecision = (savedDecisions || []).find(d => d.id === decisionId)
        if (cachedDecision) {
          savedDecision = cachedDecision
        } else {
          // Fallback: fetch by ID from database
          const { data, error } = await supabase
            .from("decisions")
            .select(`
              id,
              title,
              description,
              created_at,
              arguments (
                text,
                weight
              )
            `)
            .eq("id", decisionId)
            .single()

          if (error) {
            console.error("Error loading decision by ID:", error)
            addToast({
              description: "Erreur lors du chargement de la décision",
              title: "Erreur",
              variant: "destructive"
            })
            return
          }

          if (!data) {
            console.error("Decision not found:", decisionId)
            addToast({
              description: "Décision introuvable",
              title: "Erreur",
              variant: "destructive"
            })
            return
          }

          savedDecision = data
        }
      } else {
        savedDecision = decisionIdOrObject
      }

      // Update current decision
      setCurrentDecision({
        arguments: [],
        createdAt: savedDecision.createdAt || new Date(),
        description: savedDecision.description || "",
        id: savedDecision.id,
        title: savedDecision.title || "Décision sans titre",
        updatedAt: savedDecision.updatedAt || new Date()
      })

      // Convert saved arguments to current format with null safety
      const argumentsArray = savedDecision.arguments || []
      const loadedArgs: Argument[] = argumentsArray.map((arg, index) => ({
        id: `${savedDecision.id}-${index}`,
        text: arg?.text || "",
        weight: arg?.weight || 0
      }))

      // Call setArgs if provided (for backward compatibility)
      if (setArgs) {
        setArgs(loadedArgs)
      }

      return loadedArgs
    } catch (error) {
      console.error("Error in loadDecision:", error)
      addToast({
        description: "Erreur lors du chargement de la décision",
        title: "Erreur",
        variant: "destructive"
      })
    }
  }

  const createNewDecision = (clearArgs: () => void) => {
    setCurrentDecision({
      arguments: [],
      description: "",
      title: "Nouvelle décision"
    })
    clearArgs()
    setAiSuggestions([])
  }

  const saveDecision = async (user: User | null, args: Argument[]) => {
    if (!user) {
      addToast({
        description: "Vous devez être connecté pour sauvegarder une décision",
        title: "Connexion requise",
        variant: "destructive"
      })
      return
    }

    if (!currentDecision.title.trim()) {
      addToast({
        description: "Veuillez donner un titre à votre décision",
        title: "Titre requis",
        variant: "destructive"
      })
      return
    }

    setSaving(true)
    try {
      // Save decision
      const { data: decisionData, error: decisionError } = await supabase
        .from("decisions")
        .insert({
          description: currentDecision.description,
          title: currentDecision.title,
          user_id: user.id
        })
        .select()
        .single()

      if (decisionError) throw decisionError

      // Save arguments
      if (args.length > 0) {
        const argumentsToInsert = args.map(arg => ({
          decision_id: decisionData.id,
          text: arg.text,
          weight: arg.weight
        }))

        const { error: argumentsError } = await supabase.from("arguments").insert(argumentsToInsert)

        if (argumentsError) throw argumentsError
      }

      setCurrentDecision(prev => ({ ...prev, id: decisionData.id }))
      await loadDecisionHistory(user)
      addToast({
        description: "Décision sauvegardée avec succès !",
        title: "Succès",
        variant: "success"
      })
    } catch (error) {
      console.error("Error saving decision:", error)
      addToast({
        description: "Erreur lors de la sauvegarde",
        title: "Erreur",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const generateSuggestions = async (args: Argument[]) => {
    if (!currentDecision.title.trim()) {
      addToast({
        description: "Veuillez d'abord donner un titre à votre décision",
        title: "Titre requis",
        variant: "destructive"
      })
      return
    }

    setLoadingSuggestions(true)
    try {
      const response = await fetch("/api/suggest-arguments", {
        body: JSON.stringify({
          description: currentDecision.description,
          existingArguments: args,
          title: currentDecision.title
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
      setAiSuggestions(data.suggestions || [])
    } catch (error) {
      console.error("Error generating suggestions:", error)
      addToast({
        description: "Erreur lors de la génération des suggestions",
        title: "Erreur",
        variant: "destructive"
      })
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const addSuggestionAsArgument = (suggestion: AISuggestion, addArgumentToList: (arg: Argument) => void) => {
    const argument: Argument = {
      id: `suggestion-${suggestion.text}-${Date.now()}`,
      text: suggestion.text,
      weight: suggestion.weight
    }
    addArgumentToList(argument)
    // Remove the suggestion from the list
    setAiSuggestions(prev => prev.filter(s => s.text !== suggestion.text))
  }

  const getRecentDecisions = (count = 10) => {
    const decisions = savedDecisions || []
    const safeCount = Math.max(0, Math.min(count, decisions.length))
    return decisions.slice(0, safeCount)
  }

  const updateDecisionTitle = async (user: User | null, title: string, args: Argument[]) => {
    const updatedDecision = { ...currentDecision, title }
    setCurrentDecision(updatedDecision)

    // Auto-save if title is not empty and user is logged in
    if (user && title.trim()) {
      await autoSaveDecision(user, updatedDecision, args)
    }
  }

  const updateDecisionDescription = async (user: User | null, description: string, args: Argument[]) => {
    const updatedDecision = { ...currentDecision, description }
    setCurrentDecision(updatedDecision)

    // Auto-save if we have a title and user is logged in
    if (user && updatedDecision.title.trim()) {
      await autoSaveDecision(user, updatedDecision, args)
    }
  }

  const autoSaveDecision = async (user: User | null, decision: Decision, args: Argument[]) => {
    if (!user || !decision.title.trim()) return

    try {
      if (decision.id) {
        // Update existing decision
        const { error: decisionError } = await supabase
          .from("decisions")
          .update({
            description: decision.description,
            title: decision.title
          })
          .eq("id", decision.id)

        if (decisionError) throw decisionError

        // Delete existing arguments and insert new ones
        await supabase.from("arguments").delete().eq("decision_id", decision.id)

        if (args.length > 0) {
          const argumentsToInsert = args.map(arg => ({
            decision_id: decision.id,
            text: arg.text,
            weight: arg.weight
          }))

          const { error: argumentsError } = await supabase.from("arguments").insert(argumentsToInsert)
          if (argumentsError) throw argumentsError
        }
      } else {
        // Create new decision
        const { data: decisionData, error: decisionError } = await supabase
          .from("decisions")
          .insert({
            description: decision.description,
            title: decision.title,
            user_id: user.id
          })
          .select()
          .single()

        if (decisionError) throw decisionError

        // Save arguments
        if (args.length > 0) {
          const argumentsToInsert = args.map(arg => ({
            decision_id: decisionData.id,
            text: arg.text,
            weight: arg.weight
          }))

          const { error: argumentsError } = await supabase.from("arguments").insert(argumentsToInsert)
          if (argumentsError) throw argumentsError
        }

        setCurrentDecision(prev => ({ ...prev, id: decisionData.id }))
      }

      // The sidebar will refresh its data when needed through other mechanisms
    } catch (error) {
      console.error("Error auto-saving decision:", error)
    }
  }

  const deleteDecision = async (user: User | null, decisionId: string) => {
    if (!user) return

    try {
      // Delete arguments first (foreign key constraint)
      const { error: argsError } = await supabase.from("arguments").delete().eq("decision_id", decisionId)
      if (argsError) {
        console.error("Error deleting arguments:", argsError)
      }

      // Delete decision
      const { error } = await supabase.from("decisions").delete().eq("id", decisionId)
      if (error) {
        console.error("Error deleting decision:", error)
        throw error
      }

      // Refresh history
      await loadDecisionHistory(user)

      // If we're currently viewing this decision, create a new one
      if (currentDecision.id === decisionId) {
        setCurrentDecision({
          arguments: [],
          description: "",
          id: "",
          title: "Nouvelle décision"
        })
      }

      addToast({
        description: "Décision supprimée avec succès",
        title: "Succès",
        variant: "success"
      })
    } catch (error) {
      console.error("Error deleting decision:", error)
      addToast({
        description: "Erreur lors de la suppression",
        title: "Erreur",
        variant: "destructive"
      })
    }
  }

  const renameDecision = async (user: User | null, decisionId: string, newTitle: string) => {
    if (!user || !newTitle.trim()) return

    try {
      const { error } = await supabase.from("decisions").update({ title: newTitle.trim() }).eq("id", decisionId)

      if (error) {
        console.error("Error updating decision:", error)
        throw error
      }

      // Update current decision if it's the one being renamed
      if (currentDecision.id === decisionId) {
        setCurrentDecision(prev => ({ ...prev, title: newTitle.trim() }))
      }

      // Refresh history
      await loadDecisionHistory(user)
    } catch (error) {
      console.error("Error renaming decision:", error)
      addToast({
        description: "Erreur lors du renommage",
        title: "Erreur",
        variant: "destructive"
      })
    }
  }

  const pinDecision = async (user: User | null, decisionId: string) => {
    if (!user) return

    try {
      // Update the decision with current timestamp to move it to top
      const { error } = await supabase.from("decisions").update({ updated_at: new Date().toISOString() }).eq("id", decisionId)

      if (error) {
        console.error("Error updating decision:", error)
        throw error
      }

      // Refresh history
      await loadDecisionHistory(user)
    } catch (error) {
      console.error("Error pinning decision:", error)
      addToast({
        description: "Erreur lors de l'épinglage",
        title: "Erreur",
        variant: "destructive"
      })
    }
  }

  return {
    addSuggestionAsArgument,
    aiSuggestions,
    autoSaveDecision,
    createNewDecision,
    currentDecision,
    deleteDecision,
    generateSuggestions,
    getRecentDecisions, // Export safe recent decisions getter
    loadDecision,
    loadDecisionHistory,
    loadingHistory,
    loadingSuggestions,
    pinDecision,
    renameDecision,
    saveDecision,
    savedDecisions,
    saving,
    setCurrentDecision,
    updateDecisionDescription,
    updateDecisionTitle
  }
}
