export interface JWTPayload {
  user_id?: string
  sub?: string
  email?: string
  role?: string
  exp?: number
  iat?: number
  [key: string]: unknown
}

export class TokenParsingError extends Error {
  constructor(message: string, public readonly originalError?: Error) {
    super(message)
    this.name = 'TokenParsingError'
  }
}

/**
 * Safely parse JWT token payload without verification
 * Note: This only decodes the payload, it does not verify the token signature
 */
export function parseJWTPayload(token: string): JWTPayload {
  if (!token || typeof token !== 'string') {
    throw new TokenParsingError('Invalid token: token must be a non-empty string')
  }

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      throw new TokenParsingError('Invalid token format: JWT must have 3 parts')
    }

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    // Add padding if necessary
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)

    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload) as JWTPayload
  } catch (error) {  
    throw new TokenParsingError(
      'Failed to parse JWT token payload',
      error instanceof Error ? error : new Error(String(error))
    )
  }
}

/**
 * Extract user ID from JWT token
 */
export function extractUserIdFromToken(token: string): string {
  try {
    const payload = parseJWTPayload(token)
    return payload.user_id || payload.sub || ''
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return ''
  }
}

/**
 * Extract email from JWT token
 */
export function extractEmailFromToken(token: string): string {
  try {
    const payload = parseJWTPayload(token)
    return payload.email || ''
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return ''
  }
}

/**
 * Extract role from JWT token
 */
export function extractRoleFromToken(token: string): string {
  try {
    const payload = parseJWTPayload(token)
    return payload.role || ''
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return ''
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = parseJWTPayload(token)
    if (!payload.exp) {
      return false // If no expiration, assume it's valid
    }

    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return true // If we can't parse it, assume it's expired
  }
}

/**
 * Get token expiration date
 */
export function getTokenExpirationDate(token: string): Date | null {
  try {
    const payload = parseJWTPayload(token)
    if (!payload.exp) {
      return null
    }

    return new Date(payload.exp * 1000)
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return null
  }
}

/**
 * Get all user information from token
 */
export function extractUserInfoFromToken(token: string): {
  userId: string
  email: string
  role: string
  exp?: Date
} {
  try {
    const payload = parseJWTPayload(token)
    return {
      userId: payload.user_id || payload.sub || '',
      email: payload.email || '',
      role: payload.role || '',
      exp: payload.exp ? new Date(payload.exp * 1000) : undefined
    }
  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return {
      userId: '',
      email: '',
      role: ''
    }
  }
}