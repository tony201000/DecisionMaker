"use client"

import { ArrowLeft, FileText, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CounterDisplay } from "@/components/ui/counter-display"
import { DateDisplay } from "@/components/ui/date-display"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { RecommendationBadge } from "@/components/ui/recommendation-badge"
import { useAuth } from "@/hooks/use-auth"
import { useDecision } from "@/hooks/use-decision"
import { createClient } from "@/lib/supabase/client"
import type { Decision } from "@/types/decision"

const ITEMS_PER_PAGE = 12

export default function HistoryPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { loadDecision } = useDecision()
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const fetchAllDecisions = async () => {
      try {
        // Vérifier que l'utilisateur est toujours connecté
        const {
          data: { user: currentUser },
          error: authError
        } = await supabase.auth.getUser()

        if (authError || !currentUser) {
          router.push("/auth/login")
          return
        }

        const { data, error } = await supabase
          .from("decisions")
          .select(`
						*,
						arguments (*)
					`)
          .eq("user_id", currentUser.id)
          .order("updated_at", { ascending: false })

        if (error) throw error
        setDecisions(data || [])
        setFilteredDecisions(data || [])
      } catch (error) {
        console.error("Erreur lors du chargement des décisions:", error)
        // Si erreur d'authentification, rediriger vers la page de connexion
        if (error instanceof Error && (error.message.includes("auth") || error.message.includes("JWT"))) {
          router.push("/auth/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAllDecisions()
  }, [user, router, supabase])

  useEffect(() => {
    const filtered = (decisions || []).filter(
      decision =>
        (decision.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (decision.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDecisions(filtered)
    setCurrentPage(1)
  }, [searchTerm, decisions])

  const handleDecisionSelect = async (decisionId: string) => {
    await loadDecision(decisionId)
    router.push("/platform")
  }

  const getDecisionStats = (decision: Decision) => {
    const argumentsArray = decision.arguments || []
    const positiveScore = argumentsArray.filter(arg => arg?.weight > 0).reduce((sum, arg) => sum + (arg?.weight || 0), 0)
    const negativeScore = Math.abs(argumentsArray.filter(arg => arg?.weight < 0).reduce((sum, arg) => sum + (arg?.weight || 0), 0))
    const recommendation = getRecommendation(positiveScore, negativeScore)

    return { negativeScore, positiveScore, recommendation }
  }

  const getRecommendation = (positiveScore: number, negativeScore: number) => {
    const ratio = negativeScore > 0 ? positiveScore / negativeScore : positiveScore > 0 ? Number.POSITIVE_INFINITY : 1
    if (ratio >= 2) return "Favorable"
    if (ratio <= 0.5) return "Défavorable"
    return "Mitigé"
  }

  const totalPages = Math.ceil(Math.max(0, filteredDecisions.length) / ITEMS_PER_PAGE)
  const startIndex = Math.max(0, (currentPage - 1) * ITEMS_PER_PAGE)
  const endIndex = Math.min(filteredDecisions.length, startIndex + ITEMS_PER_PAGE)
  const paginatedDecisions = (filteredDecisions || []).slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner
          isLoading={loading}
          message="Chargement de l'historique..."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/platform")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Historique des décisions</h1>
            <p className="text-muted-foreground">
              {decisions.length} décision{decisions.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher dans vos décisions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Decisions Grid */}
        {paginatedDecisions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedDecisions.map(decision => {
                const stats = getDecisionStats(decision)
                return (
                  <Card
                    key={decision.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow border-border hover:border-primary/20"
                    onClick={() => decision.id && handleDecisionSelect(decision.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <CardTitle className="text-lg truncate">{decision.title || "Décision sans titre"}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{decision.description || "Aucune description"}</p>

                      <div className="flex items-center justify-between">
                        <RecommendationBadge recommendation={stats.recommendation as "Favorable" | "Défavorable" | "Mitigé" | "Aucune donnée"} />
                        <div className="text-sm text-muted-foreground">
                          <CounterDisplay
                            count={stats.positiveScore}
                            label=""
                            className="inline"
                          />
                          :
                          <CounterDisplay
                            count={stats.negativeScore}
                            label=""
                            className="inline"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DateDisplay date={decision.updatedAt ?? new Date()} />
                        </div>
                        <CounterDisplay
                          count={(decision.arguments || []).length}
                          label="argument"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  Page {currentPage} sur {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{searchTerm ? "Aucune décision trouvée" : "Aucune décision sauvegardée"}</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Essayez avec d'autres mots-clés" : "Commencez par créer votre première décision"}
              </p>
              {!searchTerm && <Button onClick={() => router.push("/platform")}>Créer une décision</Button>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
