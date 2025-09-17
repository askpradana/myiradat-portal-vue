# API Layer Architecture

## Overview

This directory contains the API layer for the iradat-vue application. We're transitioning to a standardized API service pattern for better error handling, consistency, and maintainability.

## Current State & Migration Plan

### Legacy Pattern (to be replaced)
```typescript
// ❌ Old pattern - manual fetch calls with inconsistent error handling
export const getProfile = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      // Manual status checking...
    }

    const data = await response.json()
    return data
  } catch (error) {
    toast.error('Error fetching profile') // Manual toast
    throw error
  }
}
```

### Modern Pattern (recommended)
```typescript
// ✅ New pattern - standardized with BaseApiService
export class UserApiService extends BaseApiService {
  async getProfile(): Promise<UserProfile | null> {
    return this.handleRequestWithToast(
      () => httpClient.get<UserProfile>('/profile'),
      'Failed to get user profile'
    )
  }
}
```

## Benefits of New Pattern

1. **Consistent Error Handling**: All errors handled through `useApiError` composable
2. **Standardized HTTP Client**: Uses centralized `httpClient` with automatic auth headers
3. **Toast Integration**: Automatic error toasts when needed
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Testability**: Easier to mock and test
6. **Maintainability**: Centralized patterns reduce code duplication

## File Organization

```
src/api/
├── base/              # Base API service classes
│   ├── ApiService.ts  # BaseApiService abstract class
│   └── index.ts       # Barrel exports
├── services/          # Modern API service classes
│   ├── UserApiService.ts
│   └── ...
├── auth/              # Legacy auth endpoints (to be migrated)
├── users/             # Legacy user endpoints (to be migrated)
├── organizations/     # Legacy org endpoints (to be migrated)
├── sessions/          # Legacy session endpoints (to be migrated)
└── README.md          # This file
```

## Migration Guidelines

When refactoring legacy API files:

1. **Create a Service Class**: Extend `BaseApiService`
2. **Use HTTP Client**: Replace manual `fetch` calls with `httpClient`
3. **Standardize Error Handling**: Use `handleRequest` or `handleRequestWithToast`
4. **Type Everything**: Define proper TypeScript interfaces
5. **Export Singleton**: Create a singleton instance for easy importing

### Example Migration

**Before (legacy):**
```typescript
// src/api/users/getProfile.ts
export const getProfile = async () => {
  // Manual fetch, error handling, etc.
}
```

**After (modern):**
```typescript
// src/api/services/UserApiService.ts
export class UserApiService extends BaseApiService {
  async getProfile() {
    return this.handleRequestWithToast(/*...*/);
  }
}

export const userApiService = new UserApiService()
```

**Usage in components:**
```typescript
// In Vue components
import { userApiService } from '@/api/services/UserApiService'

const profile = await userApiService.getProfile()
if (userApiService.hasError) {
  // Handle error state
}
```

## Testing

The new pattern makes testing much easier:

```typescript
// Mock the HTTP client
vi.mock('@/lib/httpClient')

// Test the service
const userService = new UserApiService()
const result = await userService.getProfile()
```

## Future Improvements

1. **Request Caching**: Add caching layer to BaseApiService
2. **Request Cancellation**: Implement AbortController support
3. **Retry Logic**: Add automatic retry for failed requests
4. **Offline Support**: Queue requests when offline
5. **Performance Monitoring**: Add request timing and metrics