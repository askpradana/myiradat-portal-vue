import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

export const ResendVerificationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .email({ message: 'Must be a valid email' })
      .min(1, { message: 'Email is required' }),
  })
)

export const VerifyOtpSchema = toTypedSchema(
  zod.object({
    code: zod
      .string()
      .min(6, { message: 'Verification code must be exactly 6 characters' })
      .max(6, { message: 'Verification code must be exactly 6 characters' })
      .regex(/^[A-Z0-9]{6}$/i, { message: 'Verification code must contain only letters and numbers' }),
    email: zod
      .string()
      .email({ message: 'Must be a valid email' })
      .min(1, { message: 'Email is required' }),
  })
)