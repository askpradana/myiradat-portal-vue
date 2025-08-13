import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

export const loginValidationSchema = toTypedSchema(
  zod.object({
    email: zod.email({ message: 'Must be a valid email' }).min(1, { message: 'This is required' }),
    password: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(8, { message: 'Password minimum containing 8 characters' }),
  }),
)
