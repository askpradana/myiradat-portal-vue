# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript application using Vite as the build tool. The project is an admin dashboard system called "iradat-vue" with comprehensive user management, organization management, authentication, service management capabilities, assessment features, and advanced UI/UX enhancements.

**Key Technologies:**

- Vue 3.5.18 with Composition API
- TypeScript 5.8.0 (strict mode with enhanced type safety)
- Vite 7.0.6 (build tool with Vue DevTools)
- Tailwind CSS v4.1.11 with @tailwindcss/vite
- Pinia 3.0.3 (state management)
- Vue Router 4.5.1 (with advanced navigation guards)
- TanStack Vue Query 5.83.1 & Vue Table 8.21.3 (data fetching & tables)
- reka-ui 2.4.1 components (shadcn-vue based)
- Zod 4.0.14 + Vee-Validate 4.15.1 (form validation)
- vue-sonner 2.0.2 (toast notifications)
- @vueuse/core 13.6.0 (Vue utilities)
- lucide-vue-next 0.534.0 (icons)

## Development Commands

**Package Manager:** Uses Bun (not npm/yarn)
**Node.js Requirements:** ^20.19.0 || >=22.12.0

```bash
# Install dependencies
bun install

# Development server with hot reload
bun dev

# Build for production (includes type-check)
bun build

# Build only (without type-check)
bun build-only

# Type checking only
bun type-check

# Lint and auto-fix
bun lint

# Format code with Prettier
bun format

# Preview production build
bun preview
```

## Project Architecture

### Directory Structure

- `src/api/` - API layer organized by feature domains
  - `src/api/auth/` - Authentication endpoints (verifyOtp.ts, verifyRequest.ts)
  - `src/api/organizations/` - Organization CRUD and member management
  - `src/api/services/` - Service linking and admin service management  
  - `src/api/users/` - User management, batch creation, profile operations
- `src/components/` - Component architecture with clear separation
  - `src/components/ui/` - reka-ui based design system components
  - `src/components/custom/` - Project-specific business components
    - `alerts/` - Confirmation dialogs for critical actions
    - `buttons/` - Specialized button components
    - `cards/` - Data display and dashboard cards
    - `combobox/` - Advanced selection components
    - `custom-form/` - Feature-specific form components
    - `dashboard/` - Layout and navigation components
    - `filters/` - Advanced filter system with animations
    - `notifications/` - User feedback and notification components
    - `skeletons/` - Loading state components
    - `tables/` - Data table implementations
    - `transitions/` - Reusable animation components
  - `src/components/assessment/` - Assessment and scoring components
  - `src/components/profile/` - User profile and completion widgets
- `src/composables/` - Vue composition API logic organized by domain
  - `src/composables/auth/` - Authentication and email verification
  - `src/composables/api/` - API error handling utilities
  - `src/composables/data/` - Data processing and assessment logic
  - `src/composables/forms/` - Form state and validation management
  - `src/composables/utils/` - General utility composables
- `src/data/` - Static data and configuration
- `src/lib/` - Utilities and shared logic
  - `src/lib/zod-schemas/` - Form validation schemas
  - `src/lib/composible/` - Additional composable utilities
- `src/stores/` - Pinia stores for global state
  - `userStores.ts` - Authentication, user data, and services
  - `theme.ts` - Theme and appearance management
  - `avatarStore.ts` - Avatar state management
  - `homepage.ts` - Homepage content state
- `src/types/` - TypeScript type definitions organized by feature
- `src/views/` - Page components organized by feature domains
  - `src/views/auth/` - Authentication pages
  - `src/views/admin/` - Admin management interfaces
  - `src/views/user/` - User-facing interfaces
  - `src/views/home/` - Marketing and landing pages with sections
  - `src/views/errors/` - Error handling pages
  - `src/views/layouts/` - Layout wrapper components
- `src/router/` - Vue Router with navigation guards and 404 handling

### State Management

- Uses Pinia with composition API style stores
- Main stores: `useUserStore` (authentication & user data), `useThemeStore` (theme management)
- Authentication data stored in sessionStorage for persistence

### Routing Structure

- `/` - Home page
- `/login`, `/register` - Authentication pages (with clean navigation history)
- `/dashboard` - Main dashboard
- `/dashboard/admin/*` - Admin-specific pages (user creation, batch operations)
- `/dashboard/:id/services` - User service management
- `/:pathMatch(.*)*` - 404 error page with context-aware navigation

### Component Architecture

- UI components follow shadcn-vue patterns with reka-ui primitives
- Custom components in `/custom` folder with barrel exports via index.ts
- Form validation using Vee-Validate + Zod schemas
- Uses Tailwind CSS with CSS variables for theming

### API Layer

- Organized by feature in `src/api/` directory
- Separate files for different endpoints (login.ts, register.ts, users/, services/)
- Uses TanStack Vue Query for data fetching and caching

### Important Configuration

- **Path Aliases:** `@/` maps to `src/` (configured in both Vite and TypeScript)
- **shadcn-vue Configuration:** `components.json` with new-york style, TypeScript enabled
  - Component aliases: `@/components`, `@/composables`, `@/lib/utils`, `@/components/ui`
  - Tailwind integration with CSS variables and neutral base color
  - Lucide icon library integration
- **TypeScript:** Strict mode with project references (tsconfig.app.json, tsconfig.node.json)
- **ESLint:** Modern flat config in `eslint.config.ts` with Vue + TypeScript rules
  - Custom rule overrides for UI component naming conventions
  - Prettier integration for formatting consistency
- **Build Configuration:** Vite 7 with Vue, JSX, DevTools, and Tailwind plugins

### Authentication Flow

- Token-based authentication with sessionStorage persistence
- User data, auth tokens, and services stored in Pinia store (`userStores.ts`)
- Auth state initialized on app startup via `initializeAuth()`
- **Enhanced Navigation:** Uses `router.replace()` to prevent login/register loops
- **Clean History:** Authentication success clears auth pages from browser history
- **Email Verification:** Comprehensive verification system with OTP support

### Composables Architecture

The project uses a well-organized composables system for reusable logic:

**Authentication Composables:**
- `useEmailVerification()` - Complete email verification workflow with OTP
- `useUserProfile()` - User profile management and updates

**Data & API Composables:**
- `useAssessmentData()` - Assessment scoring and data processing
- `useApiError()` - Centralized API error handling
- `useAdminServices()` - Admin service management operations

**Form Management:**
- `useProfileForm()` - Profile editing form state and validation
- `useNewsletterForm()` - Newsletter subscription handling

**Utility Composables:**
- `useUserRole()` - Role-based access control logic
- `useAvatar()` - Avatar generation and management
- `useDashboardTabs()` - Dashboard navigation state
- `useUserFilter()` - Advanced user filtering logic

## Enhanced Features & Components

### Assessment System

The application includes a comprehensive assessment and scoring system:

**Components:**
- `AssessmentCard.vue` - Individual assessment display cards
- `AssessmentOverview.vue` - Assessment summary and overview
- `ScoreIndicator.vue` - Visual score representation
- `ProfileCompletionWidget.vue` - Profile completion tracking

**Features:**
- IPRO, IPROB, IPROS assessment types with scoring
- Profile completion percentage tracking
- Last analyzed date tracking
- Visual score indicators with progress representations

### Organization Management

Advanced organization and member management system:

**Components:**
- `OrganizationCombobox.vue` - Organization selection component
- `OrganizationMemberTable.vue` - Member listing and management
- `CreateNewOrganizationForm.vue` - Organization creation workflow
- `EditOrganizationForm.vue` - Organization editing interface

**Features:**
- Complete CRUD operations for organizations
- Member addition and removal
- Organization detail views with member tables
- Batch member operations

### Error Handling & 404 System

The application includes a comprehensive 404 error handling system:

**Components:**

- `src/views/errors/NotFoundView.vue` - Branded 404 page with context-aware navigation
- Catch-all route configuration: `/:pathMatch(.*)*`

**Features:**

- **Context-Aware Navigation:** Different options based on user authentication status
- **Role-Based Suggestions:** Admin users see admin panel options
- **Consistent Branding:** Matches existing LoginView design patterns
- **Responsive Design:** Mobile-friendly with proper accessibility

### Filter Components & User Experience

Advanced filtering system with professional UI components:

**Components:**

- `FilterChip.vue` - Professional filter pills with integrated close buttons
- `OrganizationListFilter.vue` - Enhanced with keyboard support and animations
- `UserListFilter.vue` - Enhanced with keyboard support and animations

**Features:**

- **Keyboard Support:** Press Enter in search fields for immediate filtering
- **Professional Design:** Chip-style filters replacing plain text displays
- **Accessibility:** ARIA labels, keyboard navigation, and screen reader support
- **Responsive:** Mobile-optimized with proper touch interactions

**Usage:**

```vue
<!-- Filter inputs support Enter key submission -->
<Input v-model="searchQuery" @keydown.enter="applyFilters" placeholder="Search..." />

<!-- Professional filter chips -->
<FilterChip :label="filter.label" :value="filter.value" :filter-key="key" @remove="removeFilter" />
```

### Animation & Transition System

Subtle and performant animation system built with CSS transitions:

**Components:**

- `AnimatedFilterCard.vue` - Accordion-style animations for filter components

**Features:**

- **Accordion Animation:** Smooth vertical slide down/up with `max-height` transitions
- **Performance Optimized:** Hardware-accelerated CSS transforms
- **Accessibility Compliant:** Respects `prefers-reduced-motion` setting
- **Mobile Optimized:** Reduced duration for better mobile experience (300ms vs 400ms)

**Animation Specifications:**

```css
/* Accordion-style slide animation */
transition:
  max-height 400ms cubic-bezier(0.4, 0, 0.2, 1),
  opacity 300ms ease-out;

/* Accessibility fallback */
@media (prefers-reduced-motion: reduce) {
  transition: opacity 200ms ease !important;
}
```

### Navigation & Router Enhancements

Improved navigation flow and router configuration:

**Features:**

- **Clean History Management:** Authentication success uses `router.replace()` instead of `router.push()`
- **404 Handling:** Catch-all route with branded error page
- **Context-Aware Navigation:** Different navigation options based on user state
- **Email Verification Flow:** Maintains proper UX for verification process

**Router Configuration:**

```typescript
// 404 catch-all route (must be last)
createRoute('/:pathMatch(.*)*', 'not-found', NotFoundView, 'Page Not Found')
```

## TypeScript Best Practices

### Enhanced Type Safety

The codebase follows strict TypeScript practices:

**Interface Examples:**

```typescript
// API Response Types
interface BatchRegisterCSVData {
  created_users?: Array<{
    id: string
    name: string
    email: string
    phone: string
    role: string
  }>
  errors?: Array<{
    row: number
    message: string
    data?: Record<string, unknown>
  }>
  summary?: {
    total_rows: number
    successful: number
    failed: number
  }
}

// Error Handling
error: Error | null // Instead of any
```

**Code Quality Standards:**

- No `any` types allowed - use proper interfaces or `Record<string, unknown>`
- Remove unused variables and imports
- Use proper type assertions with type guards
- Follow Vue 3 + TypeScript composition API patterns

## Development Guidelines

### Component Creation

When creating new components:

1. **Follow reka-ui patterns:** Use the established design system from `src/components/ui/`
2. **Organize by feature:** Place components in appropriate `custom/` subdirectories
3. **Type safety:** Define proper TypeScript interfaces in `src/types/`
4. **Accessibility:** Include ARIA labels, keyboard support, and screen reader compatibility
5. **Responsive design:** Use Tailwind CSS v4 with mobile-first approach
6. **Animations:** Use `AnimatedFilterCard` for filter-related components with CSS transitions

### Composables Development

When creating composables:

1. **Domain organization:** Place in appropriate `src/composables/` subdirectories
2. **Composition API:** Use `<script setup>` syntax with proper imports
3. **Type safety:** Define interfaces for parameters and return values
4. **Error handling:** Use `useApiError()` for consistent API error management
5. **State management:** Integrate with Pinia stores when needed
6. **Export patterns:** Use barrel exports in `index.ts` files

### Form Implementation

For form-related components:

1. **Vee-Validate + Zod:** Use established validation pattern from `src/lib/zod-schemas/`
2. **Keyboard Support:** Add `@keydown.enter="handleSubmit"` to form inputs
3. **Professional UI:** Use `FilterChip` components for active filter displays
4. **Loading States:** Implement proper loading and error states with skeletons
5. **Accessibility:** Include proper form labels and error announcements

### API Integration

For API-related development:

1. **Feature organization:** Group endpoints by domain in `src/api/` subdirectories
2. **TanStack Query:** Use Vue Query for data fetching, caching, and mutations
3. **Type safety:** Define proper request/response interfaces
4. **Error handling:** Integrate with `useApiError()` composable
5. **Authentication:** Ensure tokens are properly managed through `userStores.ts`

### Navigation Implementation

For navigation-related features:

1. **Authentication Success:** Use `router.replace()` to clean navigation history
2. **Email Verification:** Use `router.push()` for proper UX flow
3. **Error Handling:** Redirect to branded 404 page (`NotFoundView.vue`) for invalid routes
4. **Context Awareness:** Provide different navigation options based on user authentication state
5. **Role-based routing:** Use `useUserRole()` composable for access control

### Assessment & Profile Features

When working with assessment or profile components:

1. **Score display:** Use `ScoreIndicator.vue` for consistent score visualization
2. **Profile completion:** Integrate `ProfileCompletionWidget.vue` for completion tracking
3. **Assessment data:** Use `useAssessmentData()` composable for score calculations
4. **Avatar management:** Use `useAvatar()` composable for profile image handling
5. **Progress indicators:** Implement visual feedback for completion states

## Testing Guidelines

**Manual Testing Preference:** The user prefers to handle testing manually. When making changes to forms, UI components, or adding new features:
- Skip running `bun dev` for testing purposes unless explicitly requested
- Focus on implementation and code quality
- User will test functionality manually after implementation
- Still run type-checking and linting commands (`bun type-check`, `bun lint`) to ensure code quality
