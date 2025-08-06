import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

export const RegisterFormSchema = toTypedSchema(
  zod.object({
    email: zod.email({ message: 'Must be a valid email' }).min(1, { message: 'This is required' }),
    password: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(8, { message: 'Password minimum containing 8 characters' }),
    phone: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(6, { message: 'Phone minimum containing 6 characters' }),
    name: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(3, { message: 'Username minimum containing 8 characters' }),
  }),
)

export const CreateNewUserSchema = toTypedSchema(
  zod.object({
    email: zod.email({ message: 'Must be a valid email' }).min(1, { message: 'This is required' }),
    password: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(8, { message: 'Password minimum containing 8 characters' }),
    phone: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(6, { message: 'Phone minimum containing 6 characters' }),
    name: zod
      .string()
      .min(1, { message: 'This is required' })
      .min(3, { message: 'Username minimum containing 8 characters' }),
    role: zod.string().min(1, { message: 'This is required' }).nonempty(),
  }),
)
