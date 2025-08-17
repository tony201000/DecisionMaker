"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"

/**
 * Provider React Query global pour toute l'application
 * Suit les règles du projet : État serveur dans les Actions via React Query
 */
interface Props {
  children: ReactNode
}

export function AppQueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configuration pour SSR/RSC
            staleTime: 60 * 1000, // 1 minute
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors except 401 (unauthorized)
              if (error && typeof error === 'object' && 'status' in error) {
                const status = (error as { status: number }).status
                if (status >= 400 && status < 500 && status !== 401) {
                  return false
                }
              }
              // Retry up to 3 times for other errors
              return failureCount < 3
            }
          },
          mutations: {
            retry: false, // Don't retry mutations by default
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
