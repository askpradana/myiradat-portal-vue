import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

// Address schema untuk validasi alamat dalam format JSON
const AddressSchema = zod.object({
  street: zod.string().min(1, { message: 'Street is required' }),
  city: zod.string().min(1, { message: 'City is required' }),
  state: zod.string().min(1, { message: 'State is required' }),
  country: zod.string().min(1, { message: 'Country is required' }),
  postal_code: zod.string().min(1, { message: 'Postal code is required' }),
})

// Raw Zod schema untuk type inference
const CreateOrganizationZodSchema = zod.object({
  name: zod
    .string()
    .min(1, { message: 'Organization name is required' })
    .min(3, { message: 'Organization name minimum 3 characters' }),
  description: zod
    .string()
    .min(1, { message: 'Description is required' })
    .min(10, { message: 'Description minimum 10 characters' }),
  industry: zod.string().min(1, { message: 'Industry is required' }),
  size_category: zod.enum(['small', 'medium', 'large'], {
    message: 'Please select a valid size category',
  }),
  email: zod
    .string()
    .email({ message: 'Must be a valid email' })
    .min(1, { message: 'Email is required' }),
  phone: zod
    .string()
    .min(1, { message: 'Phone number is required' })
    .min(6, { message: 'Phone minimum 6 characters' })
    .regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number' }),
  website_url: zod.string().url({ message: 'Must be a valid URL' }).optional().or(zod.literal('')),
  logo_url: zod.string().url({ message: 'Must be a valid URL' }).optional().or(zod.literal('')),
  address: AddressSchema,
})

// TypedSchema untuk vee-validate
export const CreateOrganizationSchema = toTypedSchema(CreateOrganizationZodSchema)

// Type inference dari raw Zod schema
export type CreateOrganizationFormType = zod.infer<typeof CreateOrganizationZodSchema>
