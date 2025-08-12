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
    otp: zod
      .string()
      .min(6, { message: 'OTP must be exactly 6 digits' })
      .max(6, { message: 'OTP must be exactly 6 digits' })
      .regex(/^\d{6}$/, { message: 'OTP must contain only numbers' }),
    email: zod
      .string()
      .email({ message: 'Must be a valid email' })
      .min(1, { message: 'Email is required' }),
  })
)