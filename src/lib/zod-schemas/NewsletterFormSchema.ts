import { z } from 'zod'

export const NewsletterFormSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email must be less than 100 characters')
})

export type NewsletterFormType = z.infer<typeof NewsletterFormSchema>

export const NewsletterFormDefaults: NewsletterFormType = {
  email: ''
}