import { z as zod } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const bookDemoValidationSchema = toTypedSchema(
  zod.object({
    name: zod
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    email: zod
      .string()
      .min(1, 'Email is required')
      .email('Must be a valid email address'),
    company: zod
      .string()
      .min(1, 'Company is required')
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name must not exceed 100 characters'),
    message: zod
      .string()
      .min(10, 'Message must be at least 10 characters')
      .max(500, 'Message must not exceed 500 characters')
      .optional(),
  }),
)

export { bookDemoValidationSchema }