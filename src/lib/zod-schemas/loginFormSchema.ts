import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
import { useI18n } from 'vue-i18n'

export function createLoginValidationSchema() {
  const { t } = useI18n()

  return toTypedSchema(
    zod.object({
      email: zod
        .string()
        .min(1, { message: t('validation.required') })
        .email({ message: t('validation.email') }),
      password: zod
        .string()
        .min(1, { message: t('validation.required') })
        .min(8, { message: t('validation.password.minLength', { min: 8 }) }),
    }),
  )
}

// Legacy export for backward compatibility
export const loginValidationSchema = toTypedSchema(
  zod.object({
    email: zod.email({ message: 'Must be a valid email' }).min(1, { message: 'This is required' }),
    password: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(8, { message: 'Password minimum containing 8 characters' }),
  }),
)
