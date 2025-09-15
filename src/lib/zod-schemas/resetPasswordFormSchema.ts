import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

export const ResetPasswordByUserFormSchema = toTypedSchema(
  zod
    .object({
      currentPassword: zod
        .string()
        .min(1, { message: 'Current password is required' })
        .min(8, { message: 'Password must be at least 8 characters' }),

      newPassword: zod
        .string()
        .min(1, { message: 'New password is required' })
        .min(8, { message: 'Password must be at least 8 characters' }),

      confirmPassword: zod
        .string()
        .min(1, { message: 'Please confirm your new password' })
        .min(8, { message: 'Password must be at least 8 characters' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    }),
)

export const ResetPasswordByAdminFormSchema = toTypedSchema(
  zod
    .object({
      newPassword: zod
        .string()
        .min(1, { message: 'New password is required' })
        .min(8, { message: 'Password must be at least 8 characters' }),

      confirmPassword: zod
        .string()
        .min(1, { message: 'Please confirm your new password' })
        .min(8, { message: 'Password must be at least 8 characters' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    }),
)
