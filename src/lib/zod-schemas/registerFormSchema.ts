import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

// Reusable field validators with consistent validation rules
const fieldValidators = {
  email: () =>
    zod.string()
      .min(1, { message: 'This is required' })
      .email({ message: 'Must be a valid email' }),

  password: () =>
    zod.string()
      .min(1, { message: 'This is required' })
      .min(8, { message: 'Password minimum containing 8 characters' }),

  phone: () =>
    zod.string()
      .min(1, { message: 'This is required' })
      .min(6, { message: 'Phone minimum containing 6 characters' }),

  name: () =>
    zod.string()
      .min(1, { message: 'This is required' })
      .min(3, { message: 'Name minimum containing 3 characters' }),

  role: () =>
    zod.string()
      .min(1, { message: 'This is required' })
      .nonempty({ message: 'Role is required' }),
}

// Base user schema for reuse
const baseUserSchema = zod.object({
  email: fieldValidators.email(),
  password: fieldValidators.password(),
  phone: fieldValidators.phone(),
  name: fieldValidators.name(),
})

// Schema for user registration form
export const RegisterFormSchema = toTypedSchema(baseUserSchema)

// Schema for admin creating new users (includes role field)
export const CreateNewUserSchema = toTypedSchema(
  baseUserSchema.extend({
    role: fieldValidators.role(),
  })
)
