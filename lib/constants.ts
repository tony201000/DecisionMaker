export const DECISION_CONSTANTS = {
  AUTO_SAVE_DELAY: 1000,
  MAX_ARGUMENT_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NOTE: 10,
  MAX_TITLE_LENGTH: 100,
  MIN_NOTE: -10,
  RATING_SCALE: [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const,
  TOAST_DURATION: 5000
} as const

export const VALIDATION_MESSAGES = {
  ARGUMENT_REQUIRED: "L'argument ne peut pas être vide",
  ARGUMENT_TOO_LONG: `L\'argument ne peut pas dépasser ${DECISION_CONSTANTS.MAX_ARGUMENT_LENGTH} caractères`,
  DESCRIPTION_TOO_LONG: `La description ne peut pas dépasser ${DECISION_CONSTANTS.MAX_DESCRIPTION_LENGTH} caractères`,
  NOTE_INVALID: `Le poids doit être entre ${DECISION_CONSTANTS.MIN_NOTE} et ${DECISION_CONSTANTS.MAX_NOTE}`,
  TITLE_REQUIRED: "Le titre est requis",
  TITLE_TOO_LONG: `Le titre ne peut pas dépasser ${DECISION_CONSTANTS.MAX_TITLE_LENGTH} caractères`
} as const

export const UI_CONSTANTS = {
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
  SIDEBAR_WIDTH: 280
} as const
