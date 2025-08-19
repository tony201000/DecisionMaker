# GitHub Copilot Instructions for DecisionMaker

## Project Overview

**DecisionMaker** is a Next.js 15 application that digitalizes the Seymour Schulich decision-making methodology, enhanced with AI-powered argument suggestions. Seymour Schulich is a Canadian billionaire and co-founder of Franco-Nevada, one of the world's most successful mineral royalty companies. His decision-making method, described in "Get Smarter", transforms traditional pros/cons lists into a rigorous analytical framework.

### The Schulich Method (Core Business Logic)

**3-Step Process**:
1. **Positive Arguments**: List all benefits and rate each 1-10 for importance (10 = crucial, 1 = minor)
2. **Negative Arguments**: List all drawbacks and rate each 1-10 for severity (10 = dealbreaker, 1 = negligible)  
3. **Decision Rule**: If `(total positives ÷ total negatives) ≥ 2.0`, take the action. This 2:1 ratio provides a safety margin against estimation errors.

**Key Insight**: This method prevents single strong factors from dominating decisions. A 10-point positive can be balanced by multiple small negatives (e.g., five 2-point concerns), forcing comprehensive analysis.

### Project Mission

Transform an analog decision-making method into a digital platform that:
- **Guides users through the 3-step Schulich process**
- **Enriches analysis with AI-suggested arguments**
- **Visualizes scoring patterns and decision confidence**
- **Maintains decision history for future reference and learning**

## Architecture Principles

**Server-First Approach**: Default to Server Components; use `'use client'` only when necessary (interactivity, hooks, browser APIs).

**Feature-First Structure**: Code is organized by business domain in `features/` with components, hooks, services, and schemas co-located:
```
features/
├── decision/
│   ├── components/         # Decision-specific UI (ArgumentsSection, AISuggestionsPanel, etc.)
│   └── schemas/           # Zod validation schemas for Decision, Argument models
├── auth/                  # Authentication flows  
├── platform/              # Protected dashboard areas
└── public/                # Marketing/landing pages explaining Schulich method
```

**Component Patterns**: UI components should be pure and small (<100 lines), with business logic extracted to hooks or services. Follow the existing pattern where `ArgumentsSection` orchestrates `NewArgumentForm`, `ArgumentList`, and `AISuggestionsPanel`.

## Decision Domain Models

**Core Entities** (see `types/decision.ts`):
```typescript
interface Decision {
  id: string
  title: string
  description?: string
  positiveTotal: number    // Sum of positive argument weights
  negativeTotal: number    // Sum of negative argument weights  
  ratio: number           // positiveTotal ÷ negativeTotal
  status: 'draft' | 'completed' | 'implemented'
  recommendation: 'go' | 'caution' | 'stop' // Based on ratio thresholds
  arguments: Argument[]
}

interface Argument {
  id: string
  text: string
  weight: number          // 1-10 scale per Schulich method
  type: 'positive' | 'negative'
  reasoning?: string      // For AI-suggested arguments
  isAiSuggested: boolean
}
```

**Scoring Logic**:
- **Ratio ≥ 2.0**: 🟢 "GO" recommendation (green badge)
- **Ratio 1.5-1.9**: 🟡 "CAUTION" recommendation (yellow badge)  
- **Ratio < 1.5**: 🔴 "STOP" recommendation (red badge)

**Business Rules**:
- Arguments must be weighted 1-10 (enforce with Zod validation)
- Auto-calculate totals and ratios on argument changes
- Prevent empty decisions from getting recommendations
- AI suggestions should maintain balance (don't overwhelm one side)

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

**Decision Context Examples** (for realistic testing):
```typescript
// Career Decision Example
{
  title: "Accept Senior Developer Role at Tech Startup",
  description: "Offered position at early-stage fintech startup. 30% salary increase but equity-heavy compensation. Remote-first culture but uncertain job security.",
  positiveArgs: [
    { text: "30% salary increase", weight: 8 },
    { text: "Equity upside potential", weight: 7 },
    { text: "Senior title advancement", weight: 6 },
    { text: "Remote work flexibility", weight: 7 }
  ],
  negativeArgs: [
    { text: "Job security risk at startup", weight: 8 },
    { text: "Equity might be worthless", weight: 6 },
    { text: "Longer hours expectation", weight: 5 }
  ]
}

// Financial Decision Example  
{
  title: "Buy vs Rent Apartment Decision",
  description: "Found apartment for $400k. Monthly mortgage would be $2,200 vs $1,800 rent. Plan to stay 5+ years. Have 20% down payment saved.",
  positiveArgs: [
    { text: "Building equity vs paying rent", weight: 9 },
    { text: "Stable monthly payments", weight: 7 },
    { text: "Freedom to renovate/personalize", weight: 5 },
    { text: "Tax deductions on mortgage interest", weight: 6 }
  ],
  negativeArgs: [
    { text: "Large upfront down payment", weight: 8 },
    { text: "Responsible for all repairs/maintenance", weight: 6 },
    { text: "Less flexibility to relocate", weight: 7 },
    { text: "Property value could decline", weight: 5 }
  ]
}
```

## Supabase Integration

**Authentication**: Handled via middleware (`middleware.ts`) with session management. Server operations use `lib/supabase/server.ts`, client operations use `lib/supabase/client.ts`.

**Database**: Types are generated in `supabase/types.ts`. Service classes like `DecisionCrudService` handle all database operations.

## AI Features

**Suggestions Flow**: AI argument suggestions flow through `/api/suggest-arguments` → `useAISuggestions` hook → `AISuggestionsPanel` component.

**Integration**: Uses `@ai-sdk/groq` for LLM integration. Suggestions include reasoning and are typed via `AISuggestion` interface.

**AI Prompt Strategy**: The AI analyzes the decision context (title + description + existing arguments) and suggests:
- **Missing positive arguments** the user might not have considered
- **Potential negative consequences** or risks to evaluate  
- **Alternative perspectives** from different stakeholder viewpoints
- **Contextual factors** specific to the decision domain (career, finance, personal, etc.)

**Quality Guidelines for AI**:
- Suggestions should be **specific and actionable**, not generic
- Include **reasoning** for why each argument matters
- Maintain **balance** - don't overwhelm positive or negative side
- Consider **real-world consequences** and practical implications
- Adapt **tone and complexity** to the decision's stakes and context

**AI Suggestion Types** to implement:
```typescript
interface AISuggestion {
  id: string
  type: 'positive' | 'negative'
  text: string
  reasoning: string           // Why this argument matters
  suggestedWeight: number     // AI's recommendation for 1-10 scale
  category: string           // e.g., "Financial", "Personal", "Risk", "Opportunity"
  confidence: 'high' | 'medium' | 'low'
}
```

## Development Workflow

**Code Quality**: All code is formatted/linted via Biome. Run `npm run lint` before commits. Use `npm run typecheck` to validate TypeScript.

**Key Commands**:
- `npm run dev` - Development server
- `npm run build` - Production build  
- `npm run lint` - Lint and format code
- `npm run lint:all` - Lint with unsafe fixes
- `npm run typecheck` - TypeScript validation

**Testing**: Project uses the decision analysis domain for examples - create realistic decision scenarios with pros/cons arguments.

**Schulich Method Testing Guidelines**:
- Always test with realistic decision scenarios (career, financial, personal)
- Verify ratio calculations: `positiveTotal ÷ negativeTotal`
- Test edge cases: empty decisions, single arguments, extreme weights
- Ensure AI suggestions maintain balance and provide reasoning
- Test recommendation thresholds: ≥2.0 (go), 1.5-1.9 (caution), <1.5 (stop)

**Decision Quality Metrics to Track**:
- Average time to complete a decision analysis
- Number of arguments per decision (positive vs negative)
- AI suggestion acceptance rate
- User satisfaction with final recommendations
- Decision revision frequency

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

## UX Patterns for Decision Making

**Progressive Disclosure**: Break complex decisions into manageable steps:
1. Decision setup (title, description)
2. Positive arguments collection
3. Negative arguments collection  
4. AI assistance integration
5. Results visualization and recommendation

**Cognitive Load Management**:
- Limit argument entry to one at a time with immediate feedback
- Use visual progress indicators for completion status
- Provide contextual hints for the 1-10 weighting scale
- Show running totals and ratio updates in real-time

**Error Prevention**:
- Validate argument notes within 1-10 range
- Prevent saving empty decisions
- Warn when decisions are heavily skewed (ratio > 10 or < 0.1)
- Confirm before deleting arguments or decisions

**Confidence Building**:
- Display recommendation badges with clear visual hierarchy
- Show calculation transparency (how ratios are computed)
- Provide historical context (similar past decisions)
- Include AI reasoning for suggested arguments

## Business Domain Contexts

**Career Decisions**: Job changes, promotions, career pivots, education
- Common positive factors: salary, growth, learning, work-life balance
- Common negative factors: risk, relocation, time investment, uncertainty

**Financial Decisions**: Investments, purchases, loans, insurance
- Common positive factors: returns, security, tax benefits, liquidity
- Common negative factors: risk, opportunity cost, fees, complexity

**Personal Decisions**: Relationships, health, lifestyle, family
- Common positive factors: happiness, health, relationships, fulfillment  
- Common negative factors: stress, time commitment, social impact, cost

**Business Decisions**: Strategy, hiring, partnerships, product features
- Common positive factors: revenue, market share, efficiency, innovation
- Common negative factors: cost, risk, competition, complexity

## Data Patterns and Edge Cases

**Empty State Handling**:
- New decisions start with placeholder guidance
- Empty argument lists show helpful prompts
- Zero weights default to 1 to avoid division errors

**Calculation Edge Cases**:
- When negativeTotal = 0, show "No negatives identified" instead of ∞ ratio
- When positiveTotal = 0, show "No benefits identified" with caution
- Handle decimal precision for ratios (round to 2 decimal places)

**AI Integration Patterns**:
- Debounce API calls to avoid excessive requests
- Handle API failures gracefully with retry mechanisms
- Cache suggestions to improve performance
- Provide fallback when AI is unavailable
