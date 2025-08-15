"use client"

import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { AISuggestion, Argument, Decision } from "@/types/decision"

interface SavedDecision {
  id: string
  title: string
  description: string
  created_at: string
  arguments: Array<{
    text: string
    weight: number
  }>
}

export function useDecision() {
  const [currentDecision, setCurrentDecision] = useState<Decision>({
    title: "Nouvelle décision",
    description: "",
    arguments: [],
  })
  const [saving, setSaving] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Array<AISuggestion>>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [savedDecisions, setSavedDecisions] = useState<SavedDecision[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const supabase = createClient()

  const recentDecisions = savedDecisions.slice(0, 10)

  const loadDecisionHistory = async (user: User | null) => {
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

      setSavedDecisions(decisions || [])
    } catch (error) {
      console.error("Error loading decision history:", error)
      alert("Erreur lors du chargement de l'historique")
    } finally {
      setLoadingHistory(false)
    }
  }

  const loadDecision = async (decisionId: string, setArgs: (args: Argument[]) => void) => {
    const savedDecision = savedDecisions.find((d) => d.id === decisionId)
    if (!savedDecision) {
      console.error("Decision not found:", decisionId)
      return
    }

    setCurrentDecision({
      id: savedDecision.id,
      title: savedDecision.title,
      description: savedDecision.description,
      arguments: [],
    })

    // Convert saved arguments to current format
    const loadedArgs: Argument[] = savedDecision.arguments.map((arg, index) => ({
      id: `${savedDecision.id}-${index}`,
      text: arg.text,
      weight: arg.weight,
    }))

    setArgs(loadedArgs)
  }

  const createNewDecision = (clearArgs: () => void) => {
    setCurrentDecision({
      title: "Nouvelle décision",
      description: "",
      arguments: [],
    })
    clearArgs()
    setAiSuggestions([])
  }

  const saveDecision = async (user: User | null, args: Argument[]) => {
    if (!user) {
      alert("Vous devez être connecté pour sauvegarder une décision")
      return
    }

    if (!currentDecision.title.trim()) {
      alert("Veuillez donner un titre à votre décision")
      return
    }

    setSaving(true)
    try {
      // Save decision
      const { data: decisionData, error: decisionError } = await supabase
        .from("decisions")
        .insert({
          user_id: user.id,
          title: currentDecision.title,
          description: currentDecision.description,
        })
        .select()
        .single()

      if (decisionError) throw decisionError

      // Save arguments
      if (args.length > 0) {
        const argumentsToInsert = args.map((arg) => ({
          decision_id: decisionData.id,
          text: arg.text,
          weight: arg.weight,
        }))

        const { error: argumentsError } = await supabase.from("arguments").insert(argumentsToInsert)

        if (argumentsError) throw argumentsError
      }

      setCurrentDecision((prev) => ({ ...prev, id: decisionData.id }))
      await loadDecisionHistory(user)
      alert("Décision sauvegardée avec succès !")
    } catch (error) {
      console.error("Error saving decision:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setSaving(false)
    }
  }

  const generateSuggestions = async (args: Argument[]) => {
    if (!currentDecision.title.trim()) {
      alert("Veuillez d'abord donner un titre à votre décision")
      return
    }

    setLoadingSuggestions(true)
    try {
      const response = await fetch("/api/suggest-arguments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentDecision.title,
          description: currentDecision.description,
          existingArguments: args,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate suggestions")
      }

      const data = await response.json()
      setAiSuggestions(data.suggestions || [])
    } catch (error) {
      console.error("Error generating suggestions:", error)
      alert("Erreur lors de la génération des suggestions")
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const addSuggestionAsArgument = (suggestion: AISuggestion, addArgumentToList: (arg: Argument) => void) => {
    const argument: Argument = {
      id: Date.now().toString(),
      text: suggestion.text,
      weight: suggestion.weight,
    }
    addArgumentToList(argument)
    // Remove the suggestion from the list
    setAiSuggestions((prev) => prev.filter((s) => s.text !== suggestion.text))
  }

  return {
    currentDecision,
    setCurrentDecision,
    saving,
    aiSuggestions,
    loadingSuggestions,
    savedDecisions,
    recentDecisions, // Add recentDecisions to return object
    loadingHistory,
    saveDecision,
    generateSuggestions,
    addSuggestionAsArgument,
    loadDecisionHistory,
    loadDecision,
    createNewDecision,
  }
}
