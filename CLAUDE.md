# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 + TypeScript application using Vite as the build tool. The project is an admin dashboard system called "iradat-vue" with user management features, authentication, and service management capabilities.

**Key Technologies:**
- Vue 3 with Composition API
- TypeScript
- Vite (build tool)
- Tailwind CSS v4 with @tailwindcss/vite
- Pinia (state management)
- Vue Router
- TanStack Vue Query (data fetching)
- shadcn-vue components (reka-ui based)
- Zod + Vee-Validate (form validation)

## Development Commands

**Package Manager:** Uses Bun (not npm/yarn)

```bash
# Install dependencies
bun install

# Development server with hot reload
bun dev

# Build for production
bun run build

# Type checking only
bun run type-check

# Lint and auto-fix
bun lint

# Format code
bun run format

# Preview production build
bun run preview
```

## Project Architecture

### Directory Structure
- `src/api/` - API layer with organized endpoints (auth, users, services)
- `src/components/ui/` - shadcn-vue UI components (reusable design system)
- `src/components/custom/` - Project-specific custom components
- `src/stores/` - Pinia stores (userStores.ts for auth, theme.ts for theming)
- `src/views/` - Page components organized by feature (auth/, admin/, home/, user/)
- `src/types/` - TypeScript type definitions
- `src/lib/` - Utilities and shared logic including Zod schemas
- `src/router/` - Vue Router configuration

### State Management
- Uses Pinia with composition API style stores
- Main stores: `useUserStore` (authentication & user data), `useThemeStore` (theme management)
- Authentication data stored in sessionStorage for persistence

### Routing Structure
- `/` - Home page
- `/login`, `/register` - Authentication pages
- `/dashboard` - Main dashboard
- `/dashboard/admin/*` - Admin-specific pages (user creation, batch operations)
- `/dashboard/:id/services` - User service management

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
- Path alias: `@/` maps to `src/`
- Uses shadcn-vue configuration in `components.json`
- TypeScript strict mode enabled
- ESLint + Prettier configured for code quality

### Authentication Flow
- Token-based authentication with sessionStorage persistence
- User data, auth tokens, and services stored in Pinia store
- Auth state initialized on app startup via `initializeAuth()`