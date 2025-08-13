"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Menu, Save, FolderOpen } from "lucide-react"
import { DecisionChart } from "@/components/decision-chart"
import { Label } from "@/components/ui/label"
import { Sidebar } from "@/components/sidebar"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Input } from "@/components/ui/input"

interface Argument {
  id: string
  text: string
  weight: number
}

interface Decision {
  id?: string
  title: string
  description?: string
  arguments: Argument[]
}

interface AISuggestion {
  text: string
  weight: number
  category: string
}

export default function DecisionMakerPlatform() {
  const [args, setArgs] = useState<Argument[]>([])
  const [newArgument, setNewArgument] = useState({ text: "", weight: 0 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [currentDecision, setCurrentDecision] = useState<Decision>({
    title: "Nouvelle décision",
    description: "",
    arguments: [],
  })
  const [saving, setSaving] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Array<AISuggestion>>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Centre le slider sur la valeur du poids
  const centerSlider = (weight: number) => {
    if (sliderRef.current) {
      const container = sliderRef.current
      const buttonWidth = 48 // w-12 = 48px
      const gap = 8 // gap-2 = 8px
      const buttonIndex = weight + 10 // Convert -10..10 to 0..20

      const buttonPosition = buttonIndex * (buttonWidth + gap)
      const containerWidth = container.clientWidth
      const scrollPosition = buttonPosition - containerWidth / 2 + buttonWidth / 2

      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      })
    }
  }

  // Centre quand le poids change
  useEffect(() => {
    centerSlider(newArgument.weight)
  }, [newArgument.weight])

  // Centre au montage du composant
  useEffect(() => {
    setTimeout(() => centerSlider(0), 100)
  }, [])

  const addArgument = () => {
    if (newArgument.text.trim()) {
      const argument: Argument = {
        id: Date.now().toString(),
        text: newArgument.text.trim(),
        weight: newArgument.weight,
      }
      setArgs((prev) => [...prev, argument].sort((a, b) => a.weight - b.weight))
      setNewArgument({ text: "", weight: 0 })
      setTimeout(() => centerSlider(0), 100)
    }
  }

  const removeArgument = (id: string) => {
    setArgs((prev) => prev.filter((arg) => arg.id !== id))
  }

  const updateArgumentWeight = (id: string, weight: number) => {
    setArgs((prev) => prev.map((arg) => (arg.id === id ? { ...arg, weight } : arg)).sort((a, b) => a.weight - b.weight))
  }

  const saveDecision = async () => {
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

  const generateSuggestions = async () => {
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

  const addSuggestionAsArgument = (suggestion: AISuggestion) => {
    const argument: Argument = {
      id: Date.now().toString(),
      text: suggestion.text,
      weight: suggestion.weight,
    }
    setArgs((prev) => [...prev, argument].sort((a, b) => a.weight - b.weight))

    // Remove the suggestion from the list
    setAiSuggestions((prev) => prev.filter((s) => s.text !== suggestion.text))
  }

  // Calculs des scores
  const positiveScore = args.filter((arg) => arg.weight > 0).reduce((sum, arg) => sum + arg.weight, 0)
  const negativeScore = Math.abs(args.filter((arg) => arg.weight < 0).reduce((sum, arg) => sum + arg.weight, 0))

  const sortedArguments = [...args].sort((a, b) => a.weight - b.weight)

  // Fonction pour obtenir les couleurs selon le poids
  const getGradient = (val: number) => {
    if (val <= -8) return "bg-red-600 text-black"
    if (val <= -5) return "bg-red-500 text-black"
    if (val <= -2) return "bg-orange-400 text-black"
    if (val < 0) return "bg-yellow-400 text-black"
    if (val === 0) return "bg-gray-300 text-black"
    if (val <= 2) return "bg-green-300 text-black"
    if (val <= 5) return "bg-green-400 text-black"
    if (val <= 8) return "bg-green-500 text-black"
    return "bg-green-600 text-black"
  }

  const RatingSlider = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
    const ratings = Array.from({ length: 21 }, (_, i) => i - 10)

    return (
      <div className="w-full">
        <div ref={sliderRef} className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 px-4 space-x-2">
          {ratings.map((val) => {
            const isActive = val === value
            return (
              <button
                key={val}
                onClick={() => onChange(val)}
                className={`flex-none w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold snap-center transition-all duration-200 ${
                  isActive ? "scale-110 ring-2 ring-blue-500" : "hover:scale-105"
                } ${getGradient(val)}`}
              >
                {val}
              </button>
            )
          })}
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {value < 0 ? "Négatif" : value > 0 ? "Positif" : "Neutre"} ({value})
          </span>
        </div>
      </div>
    )
  }

  const getArgumentColor = (weight: number) => {
    if (weight < 0) return "border-red-200 dark:border-red-800"
    if (weight > 0) return "border-green-200 dark:border-green-800"
    return "border-gray-200 dark:border-gray-800"
  }

  const getBadgeColor = (weight: number) => {
    if (weight < 0) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    if (weight > 0) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
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

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">🎯 Définissez votre décision</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Commencez par décrire clairement la décision que vous devez prendre
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="decision-title" className="text-sm font-medium">
                    Titre de la décision *
                  </Label>
                  <Input
                    id="decision-title"
                    value={currentDecision.title}
                    onChange={(e) => setCurrentDecision((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Changer d'emploi, Acheter une maison, Déménager à l'étranger..."
                    className="text-lg font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="decision-description" className="text-sm font-medium">
                    Description du contexte
                  </Label>
                  <Textarea
                    id="decision-description"
                    value={currentDecision.description || ""}
                    onChange={(e) => setCurrentDecision((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez le contexte, les enjeux, les contraintes, ou toute information importante pour cette décision..."
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {user && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={saveDecision}
                      disabled={saving || !currentDecision.title.trim()}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button variant="outline">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Mes décisions
                    </Button>
                  </div>
                )}

                {!user && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      💡 Connectez-vous pour sauvegarder vos décisions et les retrouver plus tard
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section Résultats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique */}
              <DecisionChart positiveScore={positiveScore} negativeScore={negativeScore} />

              {/* Résumé des résultats */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">🎯 Résultat de l'Analyse</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Basé sur la méthode de Seymour Schulich (ratio 2:1 requis)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Score Positif</div>
                      <div className="text-2xl font-bold text-green-600">{positiveScore}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Score Négatif</div>
                      <div className="text-2xl font-bold text-red-600">{negativeScore}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Ratio</div>
                      <div className="text-lg font-bold text-foreground">
                        {positiveScore}:{negativeScore}
                      </div>
                    </div>
                  </div>

                  {args.length === 0 ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                      <div className="text-yellow-800 dark:text-yellow-200 font-medium">Aucune donnée</div>
                      <div className="text-yellow-600 dark:text-yellow-300 text-sm mt-1">
                        Ajoutez des arguments pour obtenir une recommandation
                      </div>
                      <div className="text-yellow-600 dark:text-yellow-300 text-sm mt-2">Analysez votre situation</div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                      <div className="text-blue-800 dark:text-blue-200 text-sm">
                        Règle 2:1 de Schulich : Une décision est favorable si les arguments positifs sont au moins 2
                        fois supérieurs aux négatifs
                      </div>
                      {positiveScore >= negativeScore * 2 ? (
                        <div className="text-green-700 dark:text-green-300 font-medium mt-2">
                          ✅ Décision recommandée
                        </div>
                      ) : negativeScore > positiveScore ? (
                        <div className="text-red-700 dark:text-red-300 font-medium mt-2">
                          ❌ Décision non recommandée
                        </div>
                      ) : (
                        <div className="text-orange-700 dark:text-orange-300 font-medium mt-2">
                          ⚠️ Décision incertaine
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Section Arguments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">💭 Arguments</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Ajoutez vos arguments et notez-les de -10 (très négatif) à +10 (très positif)
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI suggestions section */}
                {currentDecision.title.trim() && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
                          🤖 Suggestions IA
                        </h3>
                        <p className="text-sm text-purple-600 dark:text-purple-300">
                          L'IA peut vous suggérer des arguments auxquels vous n'avez peut-être pas pensé
                        </p>
                      </div>
                      <Button
                        onClick={generateSuggestions}
                        disabled={loadingSuggestions}
                        variant="outline"
                        className="border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30 bg-transparent"
                      >
                        {loadingSuggestions ? "Génération..." : "Générer des suggestions"}
                      </Button>
                    </div>

                    {aiSuggestions.length > 0 && (
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
                          Suggestions générées ({aiSuggestions.length}) :
                        </div>
                        <div className="grid gap-3">
                          {aiSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-purple-200 dark:border-purple-700"
                            >
                              <div className="flex-1 space-y-2">
                                <p className="text-sm text-gray-800 dark:text-gray-200">{suggestion.text}</p>
                                <div className="flex items-center gap-2">
                                  <Badge className={getBadgeColor(suggestion.weight)}>Note: {suggestion.weight}</Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.category}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                onClick={() => addSuggestionAsArgument(suggestion)}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Ajouter
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Ajouter un nouvel argument */}
                <div className="space-y-4">
                  <Textarea
                    placeholder="Décrivez votre argument..."
                    value={newArgument.text}
                    onChange={(e) => setNewArgument((prev) => ({ ...prev, text: e.target.value }))}
                    className="min-h-[80px]"
                  />

                  {/* Slider de notation */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Note de l'argument</Label>
                    <RatingSlider
                      value={newArgument.weight}
                      onChange={(weight) => setNewArgument((prev) => ({ ...prev, weight }))}
                    />
                  </div>

                  <Button onClick={addArgument} disabled={!newArgument.text.trim()} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter l'argument
                  </Button>
                </div>

                {/* Liste des arguments */}
                {sortedArguments.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Arguments ajoutés ({sortedArguments.length})</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {sortedArguments.map((argument) => (
                        <div
                          key={argument.id}
                          className={`flex items-start gap-3 p-4 bg-muted/50 rounded-lg border ${getArgumentColor(argument.weight)}`}
                        >
                          <div className="flex-1 space-y-2">
                            <p className="text-foreground">{argument.text}</p>
                            <div className="flex items-center gap-2">
                              <Badge className={getBadgeColor(argument.weight)}>Note: {argument.weight}</Badge>
                              <div className="flex gap-1">
                                {[-2, -1, 0, 1, 2].map((offset) => {
                                  const newWeight = argument.weight + offset
                                  const isCurrentWeight = offset === 0
                                  if (newWeight < -10 || newWeight > 10) return null
                                  return (
                                    <Button
                                      key={offset}
                                      variant="outline"
                                      size="sm"
                                      className={`w-8 h-8 p-0 text-xs rounded-full ${getGradient(newWeight)} hover:scale-105 transition-all duration-200 ${
                                        isCurrentWeight
                                          ? "opacity-100 ring-2 ring-primary scale-110 font-bold"
                                          : "opacity-70"
                                      }`}
                                      onClick={() => updateArgumentWeight(argument.id, newWeight)}
                                    >
                                      {newWeight}
                                    </Button>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeArgument(argument.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
