import { Suspense } from "react"
import { HistoryPageClient } from "@/components/platform/HistoryPageClient"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner isLoading={true} message="Chargement de l'historique..." />
      </div>
    }>
      <HistoryPageClient />
    </Suspense>
  )
}
