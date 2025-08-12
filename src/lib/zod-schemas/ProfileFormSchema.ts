import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

export const ProfileFormSchema = toTypedSchema(
  zod.object({
    name: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(3, { message: 'Name must be at least 3 characters' }),
    email: zod
      .string()
      .email({ message: 'Must be a valid email' })
      .min(1, { message: 'This is required' }),
    phone: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(6, { message: 'Phone must be at least 6 characters' }),
  })
)