"use client"

import { useCallback, useEffect, useRef } from "react"
import { getGradient } from "@/utils/decision-styles"

interface RatingSliderProps {
  value: number
  onChange: (value: number) => void
}

export function RatingSlider({ value, onChange }: RatingSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const ratings = Array.from({ length: 21 }, (_, i) => i - 10)

  // Centre le slider sur la valeur du poids
  const centerSlider = useCallback((weight: number) => {
    if (sliderRef.current) {
      const container = sliderRef.current
      const buttonWidth = 48 // w-12 = 48px
      const gap = 8 // gap-2 = 8px
      const buttonIndex = weight + 10 // Convert -10..10 to 0..20

      const buttonPosition = buttonIndex * (buttonWidth + gap)
      const containerWidth = container.clientWidth
      const scrollPosition = buttonPosition - containerWidth / 2 + buttonWidth / 2

      container.scrollTo({
        behavior: "smooth",
        left: Math.max(0, scrollPosition)
      })
    }
  }, [])

  // Centre quand le poids change
  useEffect(() => {
    centerSlider(value)
  }, [value, centerSlider])

  // Centre au montage du composant
  useEffect(() => {
    setTimeout(() => centerSlider(0), 100)
  }, [centerSlider])

  return (
    <div className="w-full">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-2 px-4 space-x-2"
      >
        {ratings.map(val => {
          const isActive = val === value
          return (
            <button
              key={val}
              type="button"
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
