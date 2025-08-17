import { validateArgument } from "@/lib/validation"

export function useValidation() {
  const validateNewArgument = (text: string, weight: number) => {
    return validateArgument(text, weight)
  }

  return {
    validateNewArgument
  }
}
