import { useGenerateSuggestions } from "@/hooks/use-decision-queries"
import type { AISuggestion, Argument } from "@/types/decision"

export function useAISuggestions() {
  const { mutate: generateAISuggestions, data: aiSuggestions = [], isPending: loadingSuggestions } = useGenerateSuggestions()

  const handleGenerateSuggestions = (decision: { title: string; description?: string }, args: Argument[]) => {
    generateAISuggestions({
      args,
      decision: {
        description: decision.description || "",
        title: decision.title
      }
    })
  }

  const handleAddSuggestion = (suggestion: AISuggestion, addArgument: (arg: Argument) => void) => {
    const argument: Argument = {
      id: `suggestion-${suggestion.text}-${Date.now()}`,
      text: suggestion.text,
      weight: suggestion.weight
    }
    addArgument(argument)
  }

  return {
    aiSuggestions,
    handleAddSuggestion,
    handleGenerateSuggestions,
    loadingSuggestions
  }
}
