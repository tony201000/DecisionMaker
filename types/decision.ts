export interface Argument {
  id: string
  text: string
  note: number
}

export interface Decision {
  id?: string
  title: string
  description?: string
  arguments: Argument[]
  createdAt?: Date
  updatedAt?: Date
  isPinned?: boolean
  version?: number // For optimistic locking
}

export interface AISuggestion {
  id: string
  text: string
  note: number
  category: string
  reasoning: string
}

// Robustness types for decision management
export interface DecisionConflict {
  conflictId: string
  conflictTitle: string
  conflictUpdatedAt: Date
}

export interface UpsertResult {
  decision: Decision
  isNew: boolean
  conflicts?: DecisionConflict[]
}

export interface OptimisticLockError extends Error {
  code: "OPTIMISTIC_LOCK_FAILED"
  expectedVersion: number
  actualVersion: number
}

export interface DuplicateTitleError extends Error {
  code: "DUPLICATE_TITLE"
  existingDecisionId: string
  conflictingTitle: string
}

// Service operation types
export type DecisionOperationResult<T = Decision> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: OptimisticLockError | DuplicateTitleError | Error
      retry?: () => Promise<DecisionOperationResult<T>>
    }
