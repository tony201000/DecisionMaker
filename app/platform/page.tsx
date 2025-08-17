"use client"

import { useEffect, useState } from "react"
import { DecisionHeader } from "@/components/decision/decision-header"
import { ResultsSection } from "@/components/decision/results-section"
import { SidebarContent } from "@/components/sidebar-content"
import { WithSidebar } from "@/components/with-sidebar"
import { ArgumentsSection } from "@/features/decision/components"
import { useArguments } from "@/hooks/use-arguments"
import { useAuth } from "@/hooks/use-auth"
import { useDebounce } from "@/hooks/use-debounce"
import { useDecision } from "@/hooks/use-decision"
import { useToast } from "@/hooks/use-toast"
import { validateArgument } from "@/lib/validation"
import type { AISuggestion } from "@/types/decision"

interface NewArgument {
  text: string
  weight: number
}

export default function DecisionMakerPlatform() {
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [newArgument, setNewArgument] = useState<NewArgument>({
    text: "",
    weight: 0
  })

  const { addToast } = useToast()
  const { user } = useAuth()
  const { args, addArgument, removeArgument, updateArgumentWeight, positiveScore, negativeScore, sortedArguments, clearArguments } = useArguments()

  const {
    currentDecision,
    saving,
    createNewDecision,
    updateDecisionTitle,
    updateDecisionDescription,
    aiSuggestions,
    loadingSuggestions,
    generateSuggestions,
    autoSaveDecision
  } = useDecision()

  const { debouncedCallback: debouncedAutoSaveDecision, cancel: cancelAutoSave } = useDebounce(
    (u: typeof user, d: typeof currentDecision, a: typeof args) => {
      autoSaveDecision(u, d, a)
    },
    1000
  )

  useEffect(() => {
    if (user && currentDecision && args.length > 0) {
      debouncedAutoSaveDecision(user, currentDecision, args)
    }
    return () => {
      cancelAutoSave()
    }
  }, [args, user, currentDecision, debouncedAutoSaveDecision, cancelAutoSave])

  const handleGenerateSuggestions = () => {
    generateSuggestions(args)
  }

  const handleAddSuggestion = (suggestion: AISuggestion) => {
    addArgument({ text: suggestion.text, weight: suggestion.weight })
  }

  const handleCreateNew = () => {
    createNewDecision(clearArguments)
  }

  const handleTitleChange = (title: string) => {
    updateDecisionTitle(user, title, args)
  }

  const handleDescriptionChange = (description: string) => {
    updateDecisionDescription(user, description, args)
  }

  const handleAddArgument = () => {
    const validation = validateArgument(newArgument.text, newArgument.weight)
    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      addToast({
        description: validation.errors[0],
        title: "Erreur de validation",
        variant: "destructive"
      })
      return
    }
    setValidationErrors([])
    addArgument(newArgument)
    setNewArgument({ text: "", weight: 0 })
  }

  return (
    <WithSidebar sidebarContent={<SidebarContent />}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header avec contexte de décision */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Aide à la Décision</h1>
            <p className="text-sm text-muted-foreground">Méthode Schulich : pondérez vos arguments</p>
          </div>

          <DecisionHeader
            currentDecision={currentDecision}
            onTitleChange={handleTitleChange}
            onDescriptionChange={handleDescriptionChange}
            user={user}
            saving={saving}
            onCreateNew={handleCreateNew}
          />

          {/* Section Résultats */}
          <ResultsSection
            positiveScore={positiveScore}
            negativeScore={negativeScore}
            argumentsCount={args.length}
          />

          {/* Section Arguments */}
          <ArgumentsSection
            newArgument={newArgument}
            setNewArgument={setNewArgument}
            onAddArgument={handleAddArgument}
            sortedArguments={sortedArguments}
            onRemoveArgument={removeArgument}
            onUpdateArgumentWeight={updateArgumentWeight}
            decisionTitle={currentDecision.title}
            aiSuggestions={aiSuggestions}
            loadingSuggestions={loadingSuggestions}
            onGenerateSuggestions={handleGenerateSuggestions}
            onAddSuggestion={handleAddSuggestion}
            validationErrors={validationErrors}
          />
        </div>
      </div>
    </WithSidebar>
  )
}
