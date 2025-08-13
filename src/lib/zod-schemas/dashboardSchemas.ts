import { z } from 'zod'

// URL validation schema
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .refine(
    (url) => {
      try {
        const urlObj = new URL(url)
        return ['http:', 'https:'].includes(urlObj.protocol)
      } catch {
        return false
      }
    },
    'URL must use HTTP or HTTPS protocol'
  )

// External URL validation (not same origin)
export const externalUrlSchema = urlSchema
  .refine(
    (url) => {
      try {
        const urlObj = new URL(url)
        return urlObj.origin !== window.location.origin
      } catch {
        return false
      }
    },
    'URL must be external (different from current domain)'
  )

// Dashboard service schema (matches real API structure)
export const dashboardServiceSchema = z.object({
  code: z
    .string()
    .min(1, 'Service code is required'),
  
  name: z
    .string()
    .min(1, 'Service name is required')
    .max(100, 'Service name must be less than 100 characters'),
  
  icon_url: z
    .string()
    .url('Icon URL must be a valid URL'),
  
  redirect_to: urlSchema,
  
  created_at: z
    .string()
    .datetime()
    .optional(),
  
  updated_at: z
    .string()
    .datetime()
    .optional()
})

// Service creation schema (subset of full schema)
export const createServiceSchema = dashboardServiceSchema.pick({
  code: true,
  name: true,
  icon_url: true,
  redirect_to: true
})

// Service update schema (all fields optional except code)
export const updateServiceSchema = dashboardServiceSchema
  .partial()
  .required({ code: true })

// Tab validation schema
export const dashboardTabSchema = z.enum(['dashboard', 'users', 'data', 'profile'])

// User role validation schema
export const userRoleSchema = z.enum(['admin', 'user'])

// Dashboard layout config schema
export const dashboardLayoutConfigSchema = z.object({
  maxWidth: z.string().optional(),
  padding: z.string().optional(),
  showHeader: z.boolean().optional().default(true),
  showNavigation: z.boolean().optional().default(true)
})


// Service action validation schemas
export const serviceActionSchema = z.object({
  action: z.enum(['click']),
  serviceCode: z.string().min(1),
  timestamp: z.date().optional()
})

// Export type inference helpers
export type DashboardService = z.infer<typeof dashboardServiceSchema>
export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
export type DashboardTab = z.infer<typeof dashboardTabSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type ServiceAction = z.infer<typeof serviceActionSchema>
export type DashboardLayoutConfig = z.infer<typeof dashboardLayoutConfigSchema>

// Validation helper functions
export const validateServiceUrl = (url: string): { success: boolean; error?: string } => {
  const result = urlSchema.safeParse(url)
  return {
    success: result.success,
    error: result.success ? undefined : result.error.issues[0]?.message
  }
}

export const validateExternalUrl = (url: string): { success: boolean; error?: string } => {
  const result = externalUrlSchema.safeParse(url)
  return {
    success: result.success,
    error: result.success ? undefined : result.error.issues[0]?.message
  }
}

export const validateDashboardService = (service: unknown): { success: boolean; data?: DashboardService; error?: string } => {
  const result = dashboardServiceSchema.safeParse(service)
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    error: result.success ? undefined : result.error.issues.map(i => i.message).join(', ')
  }
}