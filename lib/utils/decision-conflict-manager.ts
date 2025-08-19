import type { DecisionConflict, DecisionOperationResult, DuplicateTitleError, OptimisticLockError } from "@/types/decision"

/**
 * Creates an OptimisticLockError
 */
export function createOptimisticLockError(expectedVersion: number, actualVersion: number): OptimisticLockError {
  const error = new Error(
    `Decision was modified by another process. Expected version ${expectedVersion}, got ${actualVersion}`
  ) as OptimisticLockError

  error.code = "OPTIMISTIC_LOCK_FAILED"
  error.expectedVersion = expectedVersion
  error.actualVersion = actualVersion
  error.name = "OptimisticLockError"

  return error
}

/**
 * Creates a DuplicateTitleError
 */
export function createDuplicateTitleError(existingDecisionId: string, conflictingTitle: string): DuplicateTitleError {
  const error = new Error(`A decision with title "${conflictingTitle}" already exists`) as DuplicateTitleError

  error.code = "DUPLICATE_TITLE"
  error.existingDecisionId = existingDecisionId
  error.conflictingTitle = conflictingTitle
  error.name = "DuplicateTitleError"

  return error
}

/**
 * Checks if an error is an OptimisticLockError
 */
export function isOptimisticLockError(error: unknown): error is OptimisticLockError {
  return error instanceof Error && "code" in error && error.code === "OPTIMISTIC_LOCK_FAILED"
}

/**
 * Checks if an error is a DuplicateTitleError
 */
export function isDuplicateTitleError(error: unknown): error is DuplicateTitleError {
  return error instanceof Error && "code" in error && error.code === "DUPLICATE_TITLE"
}

/**
 * Creates a success result
 */
export function createSuccessResult<T>(data: T): DecisionOperationResult<T> {
  return { data, success: true }
}

/**
 * Creates a failure result
 */
export function createFailureResult<T>(
  error: OptimisticLockError | DuplicateTitleError | Error,
  retry?: () => Promise<DecisionOperationResult<T>>
): DecisionOperationResult<T> {
  return { error, retry, success: false }
}

/**
 * Resolves title conflicts by appending a timestamp
 */
export function resolveConflictingTitle(originalTitle: string): string {
  const timestamp = Date.now()
  const maxLength = 255 - 15 // Reserve space for timestamp
  const truncatedTitle = originalTitle.length > maxLength ? originalTitle.substring(0, maxLength) : originalTitle

  return `${truncatedTitle} (${timestamp})`
}

/**
 * Suggests alternative titles based on conflicts
 */
export function suggestAlternativeTitles(originalTitle: string, conflicts: DecisionConflict[]): string[] {
  const suggestions: string[] = []

  // Add numbered versions
  for (let i = 2; i <= Math.min(5, conflicts.length + 2); i++) {
    suggestions.push(`${originalTitle} (${i})`)
  }

  // Add date-based version
  const today = new Date().toISOString().split("T")[0]
  suggestions.push(`${originalTitle} - ${today}`)

  // Add timestamped version as fallback
  suggestions.push(resolveConflictingTitle(originalTitle))

  return suggestions
}

/**
 * Handles Supabase errors and converts them to our custom error types
 */
export function handleSupabaseError(error: unknown): OptimisticLockError | DuplicateTitleError | Error {
  // Ensure we have a valid error object to work with
  if (!error) {
    return new Error("Unknown error occurred")
  }

  // If it's already an Error instance, check for specific patterns
  if (error instanceof Error) {
    // Handle custom function errors
    if (error.message?.includes("Expected version")) {
      const match = error.message.match(/Expected version (\d+), got (\d+)/)
      if (match) {
        return createOptimisticLockError(parseInt(match[1], 10), parseInt(match[2], 10))
      }
    }

    // Handle duplicate title from custom function
    if (error.message?.includes("already exists")) {
      return createDuplicateTitleError("unknown", "Title conflicts detected")
    }

    return error
  }

  // Handle Supabase PostgreSQL errors (object format)
  if (error && typeof error === "object" && "code" in error) {
    const dbError = error as { code?: string; constraint?: string; message?: string }

    // Handle PostgreSQL unique constraint violation
    if (dbError.code === "23505" && dbError.constraint === "unique_user_title") {
      return createDuplicateTitleError("unknown", "Title already exists")
    }

    // Handle custom function errors in object format
    if (dbError.message?.includes("Expected version")) {
      const match = dbError.message.match(/Expected version (\d+), got (\d+)/)
      if (match) {
        return createOptimisticLockError(parseInt(match[1], 10), parseInt(match[2], 10))
      }
    }

    // Handle duplicate title from custom function in object format
    if (dbError.message?.includes("already exists")) {
      return createDuplicateTitleError("unknown", "Title conflicts detected")
    }

    // Convert object error to Error instance
    return new Error(dbError.message || `Database error: ${dbError.code}`)
  }

  // For any other type, convert to string and create Error
  return new Error(String(error))
}

/**
 * Creates a retry function for failed operations
 */
export function createRetryFunction<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  backoffMs: number = 1000
): () => Promise<DecisionOperationResult<T>> {
  return async () => {
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        const result = await operation()
        return createSuccessResult(result)
      } catch (error) {
        attempt++
        const handledError = handleSupabaseError(error as Error)

        // Don't retry certain errors
        if (isDuplicateTitleError(handledError)) {
          return createFailureResult(handledError)
        }

        // Last attempt failed
        if (attempt >= maxRetries) {
          return createFailureResult(handledError)
        }

        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, backoffMs * 2 ** (attempt - 1)))
      }
    }

    return createFailureResult(new Error("Max retries exceeded"))
  }
}

/**
 * Hook for user-friendly conflict resolution UI
 */
export interface ConflictResolutionOptions {
  onResolveConflict?: (conflicts: DecisionConflict[], suggestedTitle: string) => Promise<string>
  onOptimisticLockFailed?: (error: OptimisticLockError) => Promise<boolean> // true to retry
  onDuplicateTitle?: (error: DuplicateTitleError, suggestions: string[]) => Promise<string>
  showToasts?: boolean
}

/**
 * User interaction handler for decision conflicts
 */
export class ConflictResolutionUI {
  private options: ConflictResolutionOptions

  constructor(options: ConflictResolutionOptions = {}) {
    this.options = options
  }

  /**
   * Handles operation result and provides user interaction for conflicts
   */
  async handleOperationResult<T>(result: DecisionOperationResult<T>): Promise<T> {
    if (result.success) {
      return result.data
    }

    const { error, retry } = result

    if (isOptimisticLockError(error)) {
      const shouldRetry = (await this.options.onOptimisticLockFailed?.(error)) ?? false

      if (shouldRetry && retry) {
        const retryResult = await retry()
        return this.handleOperationResult(retryResult)
      }

      throw error
    }

    if (isDuplicateTitleError(error)) {
      const suggestions = suggestAlternativeTitles(error.conflictingTitle, [])

      const newTitle = await this.options.onDuplicateTitle?.(error, suggestions)

      if (newTitle && retry) {
        // Note: This would need to be implemented in the specific service method
        // to update the title and retry
        throw new Error("Retry with new title not implemented in this context")
      }

      throw error
    }

    throw error
  }
}
