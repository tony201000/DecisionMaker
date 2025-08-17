"use client"

import { BarChart3, Clock, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SidebarStatsProps {
  totalDecisions: number
  totalArguments: number
  thisWeekDecisions?: number
}

export const SidebarStats = ({ totalDecisions, totalArguments, thisWeekDecisions = 0 }: SidebarStatsProps) => {
  return (
    <div className="mt-6">
      <Card className="border-neutral-200 dark:border-neutral-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Mes Statistiques</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-neutral-500" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Décisions prises</span>
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {totalDecisions}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3 h-3 text-neutral-500" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Arguments créés</span>
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {totalArguments}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-neutral-500" />
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Cette semaine</span>
              </div>
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {thisWeekDecisions}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
