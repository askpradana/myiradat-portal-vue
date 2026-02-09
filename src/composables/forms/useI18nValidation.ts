import { useI18n } from 'vue-i18n'

/**
 * Composable for i18n validation messages
 * Provides validation functions that return translated error messages
 */
export function useI18nValidation() {
  const { t } = useI18n()

  return {
    // Basic validation messages
    required: () => t('validation.required'),
    email: () => t('validation.email'),
    minLength: (min: number) => t('validation.minLength', { min }),
    maxLength: (max: number) => t('validation.maxLength', { max }),

    // Password validation
    password: {
      required: () => t('validation.password.required'),
      minLength: (min: number) => t('validation.password.minLength', { min }),
      tooShort: () => t('validation.password.tooShort'),
    },

    // Phone validation
    phone: {
      minLength: (min: number) => t('validation.phone.minLength', { min }),
      invalid: () => t('validation.phone.invalid'),
    },

    // Username validation
    username: {
      minLength: (min: number) => t('validation.username.minLength', { min }),
      tooShort: () => t('validation.username.tooShort'),
    },

    // Name validation
    name: {
      required: () => t('validation.name.required'),
      minLength: (min: number) => t('validation.name.minLength', { min }),
    },

    // Role validation
    role: {
      required: () => t('validation.role.required'),
    },


    // Batch validation
    batch: {
      atLeastOneUser: () => t('validation.batch.atLeastOneUser'),
      invalidCSV: () => t('validation.batch.invalidCSV'),
      noUsersToRegister: () => t('validation.batch.noUsersToRegister'),
      fixValidationErrors: () => t('validation.batch.fixValidationErrors'),
    },

    // Common validation
    common: {
      fieldRequired: () => t('validation.common.fieldRequired'),
      invalidFormat: () => t('validation.common.invalidFormat'),
      valueTooLong: () => t('validation.common.valueTooLong'),
      valueTooShort: () => t('validation.common.valueTooShort'),
    },

    // Helper function to get validation message based on type and parameters
    getMessage: (type: string, params?: Record<string, unknown>) => {
      return t(`validation.${type}`, params || {})
    },
  }
}

/**
 * Helper function to create Zod validation messages using i18n
 * This can be used directly in Zod schemas
 */
export function createI18nValidationMessage(key: string, params?: Record<string, unknown>) {
  return () => {
    const { t } = useI18n()
    return t(`validation.${key}`, params || {})
  }
}

/**
 * Common validation patterns with i18n messages
 */
export function useI18nValidationPatterns() {
  const validation = useI18nValidation()

  return {
    // Required field validation
    required: {
      message: validation.required(),
    },

    // Email validation
    email: {
      message: validation.email(),
    },

    // Password validation with common requirements
    password: {
      minLength: 8,
      message: validation.password.minLength(8),
    },

    // Phone validation with common requirements
    phone: {
      minLength: 6,
      message: validation.phone.minLength(6),
    },

    // Name validation with common requirements
    name: {
      minLength: 3,
      message: validation.name.minLength(3),
    },
  }
}