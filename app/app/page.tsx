"use client"

import { Menu } from "lucide-react"
import { useEffect, useState, useCallback, useRef } from "react"
import { ArgumentsSection } from "@/components/decision/arguments-section"
import { DecisionHeader } from "@/components/decision/decision-header"
import { ResultsSection } from "@/components/decision/results-section"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { useArguments } from "@/hooks/use-arguments"
import { useAuth } from "@/hooks/use-auth"
import { useDecision } from "@/hooks/use-decision"
import type { AISuggestion, Decision } from "@/types/decision"

export default function DecisionMakerPlatform() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const { user } = useAuth()
  const {
    args,
    newArgument,
    setNewArgument,
    addArgument,
    addArgumentDirectly,
    removeArgument,
    updateArgumentWeight,
    positiveScore,
    negativeScore,
    sortedArguments,
    setArgs,
    clearArgs,
  } = useArguments()

  const {
    currentDecision,
    setCurrentDecision,
    saving,
    aiSuggestions,
    loadingSuggestions,
    generateSuggestions,
    addSuggestionAsArgument,
    createNewDecision,
    loadDecision,
    loadDecisionHistory,
    updateDecisionTitle,
    updateDecisionDescription,
    autoSaveDecision,
  } = useDecision()

  useEffect(() => {
    if (user) {
      loadDecisionHistory(user)
    }
  }, [user, loadDecisionHistory])

  const handleLoadDecision = async (decisionId: string) => {
    const loadedArgs = await loadDecision(decisionId, setArgs)
    if (loadedArgs) {
      setArgs(loadedArgs)
    }
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [isDarkMode, isMounted])

  const prevDecisionRef = useRef<Decision>()
  const prevArgsRef = useRef<any[]>([])
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  const debouncedAutoSave = useCallback(
    (user: any, decision: Decision, args: any[]) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        console.log("[v0] Auto-saving decision:", decision.title)
        autoSaveDecision(user, decision, args)
      }, 1000) // Debounce for 1 second
    },
    [autoSaveDecision],
  )

  useEffect(() => {
    if (!user || !currentDecision.title.trim()) {
      return
    }

    // Check if decision or args actually changed
    const decisionChanged =
      !prevDecisionRef.current ||
      prevDecisionRef.current.title !== currentDecision.title ||
      prevDecisionRef.current.description !== currentDecision.description

    const argsChanged = JSON.stringify(prevArgsRef.current) !== JSON.stringify(args)

    if (decisionChanged || argsChanged) {
      console.log("[v0] Changes detected, scheduling auto-save")
      debouncedAutoSave(user, currentDecision, args)

      // Update refs
      prevDecisionRef.current = { ...currentDecision }
      prevArgsRef.current = [...args]
    }
  }, [user, currentDecision, args, debouncedAutoSave])

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  const handleTitleChange = useCallback(
    (title: string) => {
      updateDecisionTitle(user, title, args)
    },
    [user, args, updateDecisionTitle],
  )

  const handleDescriptionChange = useCallback(
    (description: string) => {
      updateDecisionDescription(user, description, args)
    },
    [user, args, updateDecisionDescription],
  )

  const handleCreateNew = () => {
    createNewDecision(clearArgs)
  }

  const handleGenerateSuggestions = () => {
    generateSuggestions(args)
  }

  const handleAddSuggestion = (suggestion: AISuggestion) => {
    addSuggestionAsArgument(suggestion, addArgumentDirectly)
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onLoadDecision={handleLoadDecision}
      />

      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-80" : "ml-0"}`}>
        <div className="fixed top-4 left-4 z-30">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-card shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 pt-16">
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
            <ResultsSection positiveScore={positiveScore} negativeScore={negativeScore} argumentsCount={args.length} />

            {/* Section Arguments */}
            <ArgumentsSection
              newArgument={newArgument}
              setNewArgument={setNewArgument}
              onAddArgument={addArgument}
              sortedArguments={sortedArguments}
              onRemoveArgument={removeArgument}
              onUpdateArgumentWeight={updateArgumentWeight}
              decisionTitle={currentDecision.title}
              aiSuggestions={aiSuggestions}
              loadingSuggestions={loadingSuggestions}
              onGenerateSuggestions={handleGenerateSuggestions}
              onAddSuggestion={handleAddSuggestion}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
