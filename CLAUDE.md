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

## Firebase Integration Notes

This starter is prepared for Firebase integration:
- Direct client-side Firebase SDK usage (no API routes)
- Manager pattern for data operations
- Firebase config should be added to environment variables

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