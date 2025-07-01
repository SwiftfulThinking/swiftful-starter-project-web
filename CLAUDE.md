# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.3.4 starter template with a comprehensive shadcn/ui component library and advanced theming system. It's designed as a foundation for building modern web applications with pre-configured UI components and best practices.

## Development Commands

```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture & Key Patterns

### Project Structure
- **App Router**: Uses Next.js 15 app directory structure
- **Component Library**: All 46 shadcn/ui components are pre-installed in `/src/components/ui/`
- **Theme System**: Centralized color management in `/src/lib/theme-colors.ts`
- **TypeScript**: Strict mode enabled with path alias `@/*` → `./src/*`

### Key Files & Their Purpose

1. **`/src/lib/theme-colors.ts`**
   - Central theme configuration with 4 pre-built themes
   - Each theme has light/dark variants
   - Uses HSL color format for easy customization
   - Provides `applyTheme()` and `getThemeColors()` helpers

2. **`/src/app/components/page.tsx`**
   - Showcase page demonstrating all UI components
   - Includes sidebar navigation and theme switcher
   - Interactive examples for each component

3. **`/src/components/theme-switcher.tsx`**
   - Theme switching UI component
   - Persists theme selection in localStorage
   - Integrates with next-themes for dark mode

### State Management Patterns
- Forms: React Hook Form + Zod validation
- Theme: CSS variables + localStorage persistence
- Dark Mode: next-themes integration

### Styling Architecture
- **Tailwind CSS**: Primary styling system with custom configuration
- **CSS Variables**: Used for theme colors (e.g., `--primary`, `--background`)
- **Component Variants**: Using class-variance-authority (CVA) in UI components

## Working with Components

All shadcn/ui components follow consistent patterns:
- Located in `/src/components/ui/`
- Use Radix UI primitives for accessibility
- Styled with Tailwind CSS classes
- Support theme colors via CSS variables

Example component usage:
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
```

## Theme Customization

To modify or add themes:
1. Edit `/src/lib/theme-colors.ts`
2. Follow the HSL format: `"hue saturation% lightness%"`
3. Ensure both light and dark variants are defined
4. Theme changes apply instantly to all components

## Firebase Integration

### Setup
1. Copy `.env.local.example` to `.env.local`
2. Add your Firebase project configuration values
3. The Firebase SDK is already installed and configured

### Architecture
- **Manager Pattern**: All Firebase operations go through managers in `/src/lib/managers/`
- **Models**: Data models with required `id` field in `/src/lib/models/`
- **Auth Context**: Authentication state managed via `AuthProvider` in `/src/contexts/auth-context.tsx`

### Authentication System
- **auth-manager.ts**: View-agnostic authentication manager handling all Firebase auth logic
- **AuthContext**: React context providing auth state and methods to components
- **Supported Auth Methods**:
  - Google SSO (with anonymous account linking)
  - Anonymous authentication
  - Sign out
  - Delete account

### Usage Example
```typescript
// In a component
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, signInWithGoogle, signInAnonymously, signOut, deleteAccount } = useAuth()
  
  // Check auth state
  if (user?.isAnonymous) {
    // User is signed in anonymously
  }
  
  // Auth methods
  await signInWithGoogle() // Sign in with Google
  await signInAnonymously() // Sign in anonymously
  await signOut() // Sign out
  await deleteAccount() // Delete account and data
}

// Direct auth-manager usage (not recommended in components)
import { authManager } from '@/lib/auth-manager'
const user = authManager.getCurrentUser()
```

### OpenAI Integration
- **openai-manager.ts**: Handles OpenAI API interactions using raw JSON requests
- **Features**:
  - Send prompts and receive text responses
  - Customize model, temperature, and other parameters
  - Add system messages and conversation history
  - Build properly formatted messages

### OpenAI Usage Example
```typescript
import { openAIManager } from '@/lib/openai-manager'

// Simple prompt
const response = await openAIManager.prompt("What is the capital of France?")

// With system message
const response = await openAIManager.prompt("Explain quantum computing", {
  systemMessage: "You are a physics professor explaining to a 10-year-old",
  temperature: 0.7
})

// With conversation history
const previousMessages = [
  openAIManager.buildMessage('user', 'What is React?'),
  openAIManager.buildMessage('assistant', 'React is a JavaScript library for building user interfaces.'),
]

const response = await openAIManager.prompt("Tell me more about hooks", {
  previousMessages,
  model: 'gpt-4.1',
  maxOutputTokens: 1000
})
```

## Important Conventions

1. **Client-Side Data Fetching**: Use Firebase client SDK directly rather than API routes
2. **Component Showcase**: The `/components` page should be maintained when adding new components
3. **Theme Consistency**: All custom components should use the CSS variable color system
4. **TypeScript**: Maintain strict typing, especially for component props and form schemas

## Commit Style Guidelines

**Note: Only apply these rules when explicitly asked to "commit"**

When explicitly asked to commit changes:
- Generate commit messages automatically based on staged changes without additional user confirmation
- Commit all changes in a single commit
- Keep commit messages short - only a few words long

### Commit Message Format:
- `[Feature] Add some button` - For new functionality or components
- `[Bug] Fix some bug` - For bug fixes and corrections  
- `[Clean] Refactored some code` - For refactoring, cleanup, or code improvements

### Examples:
- `[Feature] Add user dashboard`
- `[Bug] Fix login validation`
- `[Clean] Refactor project manager`