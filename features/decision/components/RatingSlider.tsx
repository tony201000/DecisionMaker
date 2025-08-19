"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import { useCallback } from "react"
import { cn, getSliderColor } from "@/lib/utils/decision-styles"

interface RatingSliderProps {
  value: number
  onChange: (value: number, text: string) => void
}

export function RatingSlider({ value, onChange }: RatingSliderProps) {
  const centerSlider = useCallback((note: number) => {
    if (note === 0) return "50%"
    if (note > 0) return `${50 + (note / 10) * 50}%`
    return `${50 + (note / 10) * 50}%`
  }, [])

  return (
    <div className="space-y-4">
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={([val]) => onChange(val, "")}
        min={-10}
        max={10}
        step={1}
      >
        <SliderPrimitive.Track className="bg-secondary relative grow rounded-full h-2">
          <SliderPrimitive.Range
            className={cn("absolute h-full rounded-full", getSliderColor(value))}
            style={{
              left: value < 0 ? centerSlider(value) : "50%",
              right: value > 0 ? `calc(100% - ${centerSlider(value)})` : "50%"
            }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block w-5 h-5 bg-background border-2 border-primary rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>

      {/* Affichage dynamique de la valeur sélectionnée */}
      <div className="flex justify-center items-center mt-3">
        <span className={cn("text-lg font-semibold px-3 py-1 rounded-md transition-all duration-200", "bg-secondary/20 text-foreground")}>
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
    </div>
  )
}
