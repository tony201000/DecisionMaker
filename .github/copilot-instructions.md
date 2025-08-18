# GitHub Copilot Instructions for DecisionMaker

## Project Overview

**DecisionMaker** is a Next.js 15 application that combines the Schulich decision-making methodology with AI-powered argument suggestions. It uses Supabase for authentication and data persistence, with a feature-first architecture.

## Architecture Principles

**Server-First Approach**: Default to Server Components; use `'use client'` only when necessary (interactivity, hooks, browser APIs).

**Feature-First Structure**: Code is organized by business domain in `features/` with components, hooks, services, and schemas co-located:
```
features/
├── decision/
│   ├── components/         # Decision-specific UI (ArgumentsSection, AISuggestionsPanel, etc.)
│   └── schemas/           # Zod validation schemas
├── auth/                  # Authentication flows  
├── platform/              # Protected dashboard areas
└── public/                # Marketing/landing pages
```

**Component Patterns**: UI components should be pure and small (<100 lines), with business logic extracted to hooks or services. Follow the existing pattern where `ArgumentsSection` orchestrates `NewArgumentForm`, `ArgumentList`, and `AISuggestionsPanel`.

## Data Flow & State Management

**Server State**: Use React Query (`@tanstack/react-query`) for server state, following patterns in `hooks/use-decision-queries.ts`. Service layer lives in `lib/services/` (e.g., `DecisionCrudService`).

**Client State**: Zustand stores in `lib/stores/` for complex UI state:
- `suggestions-store.ts` - AI suggestions with filters, history, and UI states
- `decision-store.ts` - Current decision editing state  
- `auth-store.ts` - Authentication state
- `ui-store.ts` - Global UI state (modals, etc.)

**Data Services**: Business logic in service classes (`lib/services/decision-crud-service.ts`) with proper Zod validation, not in components.

## Key Conventions

**Routing**: App uses route groups - `(auth)`, `(protected)`, `(public)` for logical organization.

**Styling**: Use `utils/decision-styles.ts` utilities instead of inline Tailwind classes for decision-specific styling patterns.

**Components**: 
- File names: kebab-case (`decision-header.tsx`)
- Components: PascalCase (`DecisionHeader`)
- Props should be explicitly typed with defaults where appropriate

**Validation**: All data validation uses Zod schemas from `features/*/schemas/`. Core types in `types/decision.ts` define `Decision`, `Argument`, and `AISuggestion` interfaces.

## Supabase Integration

**Authentication**: Handled via middleware (`middleware.ts`) with session management. Server operations use `lib/supabase/server.ts`, client operations use `lib/supabase/client.ts`.

**Database**: Types are generated in `supabase/types.ts`. Service classes like `DecisionCrudService` handle all database operations.

## AI Features

**Suggestions**: AI argument suggestions flow through `/api/suggest-arguments` → `useAISuggestions` hook → `AISuggestionsPanel` component.

**Integration**: Uses `@ai-sdk/groq` for LLM integration. Suggestions include reasoning and are typed via `AISuggestion` interface.

## Development Workflow

**Code Quality**: All code is formatted/linted via Biome. Run `npm run lint` before commits. Use `npm run typecheck` to validate TypeScript.

**Key Commands**:
- `npm run dev` - Development server
- `npm run build` - Production build  
- `npm run lint` - Lint and format code
- `npm run lint:all` - Lint with unsafe fixes
- `npm run typecheck` - TypeScript validation

**Testing**: Project uses the decision analysis domain for examples - create realistic decision scenarios with pros/cons arguments.

## Current Architecture Context

The codebase follows established patterns with clear separation of concerns:

1. **UI Components**: Located in `features/decision/components/` - pure, focused components
2. **Business Logic**: Service classes in `lib/services/` handle all data operations  
3. **State Management**: Zustand stores provide reactive state with devtools support
4. **Styling**: Utility functions in `lib/utils/decision-styles.ts` for decision-specific colors and gradients
5. **Validation**: Zod schemas in feature directories ensure type safety

The architecture maintains clean separation between feature-specific components (`features/decision/components/`) and generic reusable UI components (`components/ui/`).

## Error Handling & UX

**Error Boundaries**: Wrapped at app level (`components/layout/error-boundary.tsx`).

**Toasts**: Use the custom toast system (`hooks/use-toast.tsx`) only in page/feature containers, never in pure UI components.

**Form Validation**: Display validation errors inline using form state, not toasts.

## Accessibility

**Component Library**: Built on Radix UI primitives via shadcn/ui for accessibility compliance.

**Navigation**: Keyboard navigation and focus management are critical for decision-making workflows.

**Semantic HTML**: Use proper heading hierarchy and ARIA labels, especially in decision analysis interfaces.
