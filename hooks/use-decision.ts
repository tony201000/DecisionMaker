"use client"

import type { User } from "@supabase/supabase-js"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { AISuggestion, Argument, Decision } from "@/types/decision"

export function useDecision() {
  const [currentDecision, setCurrentDecision] = useState<Decision>({
    title: "Nouvelle décision",
    description: "",
    arguments: [],
  })
  const [saving, setSaving] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Array<AISuggestion>>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const supabase = createClient()

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
    saveDecision,
    generateSuggestions,
    addSuggestionAsArgument,
  }
}
