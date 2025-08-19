import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Decision styles utilities
export const getGradient = (val: number) => {
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

export const getArgumentColor = (note: number) => {
  if (note < 0) return "border-red-200 dark:border-red-800"
  if (note > 0) return "border-green-200 dark:border-green-800"
  return "border-gray-200 dark:border-gray-800"
}

export const getBadgeColor = (note: number) => {
  if (note < 0) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  if (note > 0) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
}

export const getSliderColor = (value: number) => {
  if (value <= -8) return "bg-red-600"
  if (value <= -5) return "bg-red-500"
  if (value <= -2) return "bg-orange-400"
  if (value < 0) return "bg-yellow-400"
  if (value === 0) return "bg-gray-300"
  if (value <= 2) return "bg-green-300"
  if (value <= 5) return "bg-green-400"
  if (value <= 8) return "bg-green-500"
  return "bg-green-600"
}
