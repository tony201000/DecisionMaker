export interface Argument {
  id: string
  text: string
  weight: number
}

export interface Decision {
  id?: string
  title: string
  description?: string
  arguments: Argument[]
  createdAt?: Date
  updatedAt?: Date
}

export interface AISuggestion {
  id: string
  text: string
  weight: number
  category: string
  reasoning: string
}
