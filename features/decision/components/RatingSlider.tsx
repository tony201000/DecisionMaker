"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import { useCallback } from "react"
import { cn } from "@/lib/utils/decision-styles"

interface RatingSliderProps {
  value: number
  onChange: (value: number, text: string) => void
}

const ratings = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10]

export function RatingSlider({ value, onChange }: RatingSliderProps) {
  const centerSlider = useCallback((weight: number) => {
    if (weight === 0) return "50%"
    if (weight > 0) return `${50 + (weight / 10) * 50}%`
    return `${50 + (weight / 10) * 50}%`
  }, [])

  return (
    <div className="space-y-4">
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={([val]) => onChange(val, "")}
        min={-10}
        max={10}
        step={2}
      >
        <SliderPrimitive.Track className="bg-secondary relative grow rounded-full h-2">
          <SliderPrimitive.Range
            className={cn("absolute h-full rounded-full", value > 0 ? "bg-green-500" : value < 0 ? "bg-red-500" : "bg-gray-500")}
            style={{
              left: value < 0 ? centerSlider(value) : "50%",
              right: value > 0 ? `calc(100% - ${centerSlider(value)})` : "50%"
            }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-5 h-5 bg-background border-2 border-primary rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>

      <div className="flex justify-between text-xs text-muted-foreground">
        {ratings.map(val => (
          <button
            key={val}
            type="button"
            className={cn(
              "cursor-pointer hover:text-foreground transition-colors bg-transparent border-none p-1 rounded",
              val === value && "text-foreground font-medium"
            )}
            onClick={() => onChange(val, "")}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onChange(val, "")
              }
            }}
            aria-label={`Définir la note à ${val > 0 ? `+${val}` : val}`}
          >
            {val > 0 ? `+${val}` : val}
          </button>
        ))}
      </div>
    </div>
  )
}
