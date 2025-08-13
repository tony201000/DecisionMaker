"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { useMemo } from "react"

interface DecisionChartProps {
  positiveScore: number
  negativeScore: number
}

export function DecisionChart({ positiveScore, negativeScore }: DecisionChartProps) {
  const totalScore = positiveScore + negativeScore

  // When negativeScore > positiveScore, needle should point left (negative angle)
  // When positiveScore > negativeScore, needle should point right (positive angle)
  // When equal, needle should point center (0 degrees)
  const needleAngle = useMemo(() => {
    if (totalScore === 0) return 0 // Center position when no data

    // Calculate the difference ratio: -1 (all negative) to +1 (all positive)
    const balance = (positiveScore - negativeScore) / totalScore

    // Map balance to angle: -90° (left/red) to +90° (right/green)
    return balance * 90
  }, [positiveScore, negativeScore, totalScore])

  // Determine recommendation based on 2:1 rule
  const recommendation = useMemo(() => {
    if (totalScore === 0) return { text: "Aucune donnée", color: "text-gray-500" }
    if (positiveScore >= negativeScore * 2) return { text: "Favorable", color: "text-green-600" }
    if (negativeScore >= positiveScore * 2) return { text: "Défavorable", color: "text-red-600" }
    return { text: "Mitigé", color: "text-orange-600" }
  }, [positiveScore, negativeScore])

  // Create gradient stops for the semicircle
  const gradientId = "gaugeGradient"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Analyse de Décision
        </CardTitle>
        <CardDescription>Visualisation semi-circulaire basée sur la méthode Schulich</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-8">
          {/* Semicircular Gauge */}
          <div className="relative">
            <svg width="300" height="160" viewBox="0 0 300 160" className="overflow-visible">
              {/* Gradient definition */}
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="20%" stopColor="#ea580c" />
                  <stop offset="40%" stopColor="#f59e0b" />
                  <stop offset="60%" stopColor="#eab308" />
                  <stop offset="80%" stopColor="#84cc16" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>

              {/* Background semicircle */}
              <path
                d="M 30 140 A 120 120 0 0 1 270 140"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
                className="dark:stroke-gray-700"
              />

              {/* Colored semicircle */}
              <path
                d="M 30 140 A 120 120 0 0 1 270 140"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="20"
                strokeLinecap="round"
              />

              {/* Center circle (white background for needle pivot) */}
              <circle
                cx="150"
                cy="140"
                r="12"
                fill="white"
                stroke="#374151"
                strokeWidth="2"
                className="dark:fill-gray-800 dark:stroke-gray-300"
              />

              {/* Needle points upward at 0°, left at -90°, right at +90° */}
              <line
                x1="150"
                y1="140"
                x2={150 + Math.sin((needleAngle * Math.PI) / 180) * 100}
                y2={140 - Math.cos((needleAngle * Math.PI) / 180) * 100}
                stroke="#374151"
                strokeWidth="3"
                strokeLinecap="round"
                className="dark:stroke-gray-200"
              />

              {/* Needle pivot point */}
              <circle cx="150" cy="140" r="6" fill="#374151" className="dark:fill-gray-200" />
            </svg>
          </div>

          <div className="flex items-center justify-between w-full max-w-sm relative">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {negativeScore}
              </div>
              <p className="text-sm text-red-600 mt-2 font-medium">Négatifs</p>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <p className={`text-xl font-bold ${recommendation.color}`}>{recommendation.text}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {positiveScore}
              </div>
              <p className="text-sm text-green-600 mt-2 font-medium">Positifs</p>
            </div>
          </div>

          {/* Rule explanation */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 max-w-md">
            <p>
              Règle 2:1 de Schulich : Une décision est favorable si les arguments positifs sont au moins 2 fois
              supérieurs aux négatifs.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
