"use client"

import { useCallback, useMemo, useState } from "react"
import type { Argument } from "@/types/decision"

export function useArguments(initialArguments: Argument[] = []) {
  const [args, setArgs] = useState<Argument[]>(initialArguments)

  const addArgument = useCallback((argument: Omit<Argument, "id">) => {
    if (argument.text.trim()) {
      const newArgument: Argument = {
        ...argument,
        id: crypto.randomUUID()
      }
      setArgs(prev => [...prev, newArgument])
    }
  }, [])

  const removeArgument = useCallback((id: string) => {
    setArgs(prev => prev.filter(arg => arg.id !== id))
  }, [])

  const updateArgumentWeight = useCallback((id: string, weight: number) => {
    setArgs(prev => prev.map(arg => (arg.id === id ? { ...arg, weight } : arg)))
  }, [])

  const setArguments = useCallback((newArgs: Argument[]) => {
    setArgs(newArgs)
  }, [])

  const clearArguments = useCallback(() => {
    setArgs([])
  }, [])

  const positiveScore = useMemo(() => args.filter(arg => arg.weight > 0).reduce((sum, arg) => sum + arg.weight, 0), [args])

  const negativeScore = useMemo(() => Math.abs(args.filter(arg => arg.weight < 0).reduce((sum, arg) => sum + arg.weight, 0)), [args])

  const sortedArguments = useMemo(() => [...args].sort((a, b) => a.weight - b.weight), [args])

  return {
    addArgument,
    args,
    clearArguments,
    negativeScore,
    positiveScore,
    removeArgument,
    setArguments,
    sortedArguments,
    updateArgumentWeight
  }
}
