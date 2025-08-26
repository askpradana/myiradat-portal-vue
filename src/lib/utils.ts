import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Masks an email address for privacy
 * Shows first and last character before @, and domain extension after last dot
 * @param email - The email address to mask
 * @returns Masked email address
 * @example
 * maskEmail('smith@mail.com') // returns 's***h@***.com'
 * maskEmail('john@example.co') // returns 'j***n@***.co'
 * maskEmail('a@test.org') // returns 'a@***.org'
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email // Return original if invalid email format
  }

  const [username, domain] = email.split('@')
  
  // Handle username masking
  let maskedUsername = username
  if (username.length > 1) {
    maskedUsername = `${username[0]}***${username[username.length - 1]}`
  }
  
  // Handle domain masking - show only extension after last dot
  let maskedDomain = '***'
  const lastDotIndex = domain.lastIndexOf('.')
  if (lastDotIndex !== -1) {
    maskedDomain = `***${domain.substring(lastDotIndex)}`
  }
  
  return `${maskedUsername}@${maskedDomain}`
}
