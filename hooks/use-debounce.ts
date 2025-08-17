import { useCallback, useRef } from "react"

/**
 * Hook pour debouncer une fonction
 * @param callback - La fonction à debouncer
 * @param delay - Le délai en millisecondes
 * @returns La fonction debouncée avec une méthode cancel
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Garder la référence du callback à jour
  callbackRef.current = callback

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      // Annuler le timeout précédent s'il existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Créer un nouveau timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
        timeoutRef.current = null
      }, delay)
    }) as T,
    []
  )

  // Fonction pour annuler le debounce
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Nettoyage à la destruction du composant
  const cleanup = useCallback(() => {
    cancel()
  }, [cancel])

  return {
    cancel,
    cleanup,
    debouncedCallback
  }
}
