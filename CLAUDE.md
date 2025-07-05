# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.3.4 starter template with a comprehensive shadcn/ui component library and advanced theming system. It's designed as a foundation for building modern web applications with pre-configured UI components and best practices.

### Tech Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5.x with strict mode
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: shadcn/ui (all 46 components pre-installed)
- **Animations**: Lottie animations via lottie-react
- **Video Player**: react-player for YouTube, Vimeo, and direct video URLs
- **Authentication**: Firebase Auth with Firestore user profiles
- **Database**: Firebase Firestore
- **AI Integration**: OpenAI API (Chat & Reasoning models)
- **State Management**: React Context (auth only) + local state
- **Forms**: React Hook Form + Zod validation
- **Themes**: next-themes + custom theme system

### Key Features
- 🎨 4 pre-built color themes with dark mode support
- 🔐 Complete authentication flow with Google SSO
- 🤖 OpenAI integration with model switching
- 📱 Responsive design with mobile-first approach
- ♿ Accessible components via Radix UI
- 🚀 Production-ready with TypeScript strict mode

## Getting Started

### Creating a New Project
Use the rename script to create a new project from this template:
```bash
./rename_project.sh "My New Project Name"
cd ../my-new-project-name
```

### Initial Setup
1. Copy `.env.local.example` to `.env.local`
2. Add your Firebase configuration
3. Add your OpenAI API key
4. Run `npm install`
5. Run `npm run dev`

### Development Commands
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

### ResponsiveLottie Component
A custom component for displaying Lottie animations:
- Loads animations from URLs (JSON format)
- Responsive sizing with full container support
- Playback modes: 'loop' or 'once'
- Built-in loading and error states

Usage:
```tsx
import { ResponsiveLottie } from "@/components/ui/responsive-lottie"

// Loop animation
<ResponsiveLottie 
  url="https://example.com/animation.json" 
  playbackMode="loop"
  className="h-48" 
/>

// Play once
<ResponsiveLottie 
  url="https://example.com/animation.json" 
  playbackMode="once"
/>
```

### ResponsivePlayer Component
A custom component for displaying videos from various sources:
- Supports YouTube, Vimeo, Twitch, SoundCloud, and direct video URLs
- Responsive sizing with full container support
- Playback modes: 'loop' or 'once'
- Configurable controls, volume, muted, and autoplay settings
- Server-side rendering safe with dynamic imports

Usage:
```tsx
import { ResponsivePlayer } from "@/components/ui/responsive-player"

// YouTube video with controls
<ResponsivePlayer 
  url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
  controls={true}
  className="h-64"
/>

// Direct video URL, muted autoplay loop
<ResponsivePlayer 
  url="https://example.com/video.mp4" 
  playbackMode="loop"
  muted={true}
  playing={true}
/>

// Vimeo with custom volume
<ResponsivePlayer 
  url="https://vimeo.com/90283590" 
  volume={0.5}
  controls={true}
/>
```

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
- **Storage**: File uploads handled by storage-manager in `/src/lib/storage-manager.ts`

### Authentication & User Profile System

#### Architecture Overview
1. **auth-manager.ts**: Singleton class managing all Firebase Auth operations
   - Handles authentication state and listeners
   - Automatically creates user profiles in Firestore on first sign-in
   - Provides simplified AuthUser interface (uid, email, displayName, photoURL, isAnonymous)
   - Google provider configured with `prompt: 'select_account'`

2. **User Profile Storage**:
   - User profiles stored in Firestore `users` collection
   - Document ID matches Firebase Auth UID
   - Profile created automatically on first Google sign-in with:
     - email, displayName, photoURL
     - createdAt/updatedAt timestamps
     - role (default: 'user')
     - isActive (default: true)

3. **AuthContext**: React context wrapping auth-manager
   - Provides auth state and methods to components
   - Handles loading states
   - Auto-refreshes on auth state changes

4. **Protected Routes**: Pages check auth state and redirect if needed
   - `/home`, `/components`, `/profile`, `/openai` require authentication
   - Redirect to landing page (`/`) if not authenticated

#### Supported Auth Methods
- **Google SSO**: With email picker (always shows account selection)
- **Anonymous Sign In**: For temporary access
- **Account Linking**: Anonymous users can upgrade to Google account
- **Sign Out**: Clears auth state
- **Delete Account**: Removes Firestore data and auth account

#### Data Models
```typescript
// AuthUser (from auth-manager)
interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAnonymous: boolean
}

// User (Firestore document)
interface User {
  id: string
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  updatedAt: Date
  role: 'user' | 'admin'
  isActive: boolean
}
```

#### Usage Examples
```typescript
// In a component
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, loading, signInWithGoogle, signInAnonymously, signOut, deleteAccount } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  if (!user) {
    // User not authenticated
    return <button onClick={signInWithGoogle}>Sign In</button>
  }
  
  // Access user data
  console.log(user.email, user.isAnonymous)
}

// Fetch full user profile from Firestore
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const userRef = doc(db, 'users', user.uid)
const userSnap = await getDoc(userRef)
const fullProfile = userSnap.data()
```

### OpenAI Integration

#### Overview
- **openai-manager.ts**: Handles OpenAI API interactions using raw JSON requests (no SDK)
- **Two Different APIs**: 
  - **Chat Completions API** (`/chat/completions`): For GPT-3.5, GPT-4 models
  - **Reasoning API** (`/responses`): For O1, O3 reasoning models
- **Automatic Routing**: The `prompt()` method automatically routes to the correct API based on model

#### Available Models
```typescript
// Chat models (use /chat/completions endpoint)
- gpt-3.5-turbo
- gpt-4
- gpt-4-turbo

// Reasoning models (use /responses endpoint)
- o1-preview
- o1-mini
- o3
- o3-mini
```

#### API Differences
1. **Chat Completions API**:
   - Standard OpenAI format
   - Simple message array with role/content
   - Synchronous responses

2. **Reasoning API**:
   - Different request structure with `input` array
   - Supports `developer` role (converted from `system`)
   - Includes reasoning configuration (effort, summary)
   - Requires organization verification for summaries
   - Response in `output` array format

#### Usage Examples
```typescript
import { openAIManager } from '@/lib/openai-manager'

// Automatically uses Chat API
const response = await openAIManager.prompt("What is the capital of France?", {
  model: 'gpt-3.5-turbo'
})

// Automatically uses Reasoning API
const response = await openAIManager.prompt("Solve this complex problem", {
  model: 'o3',
  reasoningEffort: 'high',
  reasoningSummary: 'auto'
})

// With system message (becomes 'developer' role for reasoning models)
const response = await openAIManager.prompt("Explain quantum computing", {
  model: 'o1-preview',
  systemMessage: "You are a physics professor",
  temperature: 0.7
})

// Access available models
const models = openAIManager.availableModels
// Returns array of { value: 'gpt-4', label: 'GPT-4' } objects
```

### Firebase Storage Integration

#### Overview
- **storage-manager.ts**: Handles all Firebase Storage operations
- **Singleton Pattern**: Export instance, not class
- **Error Handling**: User-friendly error messages
- **File Organization**: Generate unique paths with timestamps

#### Available Methods
```typescript
import { storageManager } from '@/lib/storage-manager'

// Upload a single file
const file = event.target.files[0] // From file input
const url = await storageManager.uploadFile('uploads/images/profile.jpg', file)

// Upload with unique path generation
const uniquePath = storageManager.generateUniquePath('uploads/images', file.name)
const url = await storageManager.uploadFile(uniquePath, file)

// Upload multiple files
const files = Array.from(event.target.files) // From multi-file input
const urls = await storageManager.uploadMultipleFiles('uploads/documents', files)

// Get download URL for existing file
const url = await storageManager.getFileUrl('uploads/images/profile.jpg')

// Delete a file
await storageManager.deleteFile('uploads/images/old-profile.jpg')

// List all files in a directory
const filePaths = await storageManager.listFiles('uploads/images')
```

#### Usage Examples
```typescript
// Profile picture upload
const handleProfilePicture = async (file: File) => {
  try {
    const path = storageManager.generateUniquePath(`users/${user.uid}/profile`, file.name)
    const downloadUrl = await storageManager.uploadFile(path, file)
    
    // Update user profile with new photo URL
    await userManager.update(user.uid, { photoURL: downloadUrl })
    toast.success('Profile picture updated')
  } catch (error) {
    toast.error('Failed to upload profile picture')
  }
}

// Document upload with validation
const handleDocumentUpload = async (files: FileList) => {
  const validFiles = Array.from(files).filter(file => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png']
    return validTypes.includes(file.type) && file.size < 10 * 1024 * 1024 // 10MB
  })
  
  if (validFiles.length === 0) {
    toast.error('Please select valid PDF or image files under 10MB')
    return
  }
  
  const urls = await storageManager.uploadMultipleFiles(`documents/${user.uid}`, validFiles)
  // Save URLs to Firestore...
}
```

## Important Conventions

### Core Principles
1. **Client-Side First**: All pages use `'use client'` directive - no server components
2. **No API Routes**: All data operations use Firebase client SDK directly
3. **TypeScript Strict Mode**: No explicit `any` types except in error catches
4. **Component Library**: Use existing shadcn/ui components before creating custom ones

### File & Code Organization
- **File Naming**: Use kebab-case for all files (e.g., `auth-manager.ts`, `theme-switcher.tsx`)
- **Imports**: Always use `@/` path alias, group imports by type
- **Icons**: Use only `lucide-react` icons for consistency
- **Components**: Export named exports, not default exports

### UI/UX Patterns
- **Error Handling**: Always show toast notifications with user-friendly messages
  ```typescript
  try {
    // operation
  } catch (error: any) {
    toast.error(error.message || "Fallback message")
  }
  ```
- **Loading States**: Use "Loading..." text or `<Loader2 className="animate-spin" />`
- **Form Submission**: Support Cmd+Enter keyboard shortcut
- **Protected Routes**: Global auth protection via AuthGuard in root layout

### Styling Guidelines
- **Tailwind Only**: No CSS modules or styled-components
- **Conditional Classes**: Use `cn()` helper from `@/lib/utils`
- **Theme Colors**: Always use CSS variables (e.g., `bg-primary`, not hardcoded colors)
- **Spacing**: Follow Tailwind's default spacing scale

### Authentication Flow
- **Global Protection**: All pages (except allowed paths) are protected by `AuthGuard` component in root layout
- **Allowed Paths**: Only `/` (landing) and `/components` are accessible without authentication
- **AuthGuard Component**: Located at `/src/components/auth-guard.tsx`
  - Wraps entire app in root layout
  - Shows loading spinner during auth check
  - Redirects to landing page if not authenticated
  - Configurable via `allowedPaths` prop
- **useAuthGuard Hook**: Available at `/src/hooks/use-auth-guard.tsx` for custom auth logic
- **Sign Out**: Always redirect to landing page after sign out
- **User Profiles**: Automatically created in Firestore on first sign-in
- **Adding New Pages**: No auth code needed - protection is automatic!

### Sidebar Navigation
- **Structure**: Every authenticated page must include the sidebar
- **Active States**: Set `isActive` prop on current page's menu item
- **User Footer**: Shows profile picture, name, email, and settings popover

### Manager Pattern Rules
- **Singleton**: Export instance, not class (e.g., `export const authManager = new AuthManager()`)
- **Type Conversion**: All managers must implement `toModel()` and `toFirestore()` methods
- **Never Return Raw Data**: Always return typed model interfaces, never DocumentData
- **Error Handling**: Console.error for debugging, throw user-friendly errors
- **Firestore**: Document ID must match the model's `id` field
- **Default Values**: Handle null/undefined fields in `toModel()` with appropriate defaults

### Environment Variables
- **Client-Side Only**: All env vars must start with `NEXT_PUBLIC_`
- **Required**: Firebase config (7 vars) and OpenAI API key
- **Example File**: `.env.local.example` must be kept updated

### Component Patterns
- **Radix UI**: All UI components built on Radix primitives
- **Compound Components**: Use component composition (Card, CardHeader, etc.)
- **Ref Forwarding**: Always use forwardRef for custom components
- **Class Names**: All components must accept `className` prop

### Data Fetching & Type Safety
- **No Server Fetching**: All data fetched client-side
- **Always Convert Firestore Data**: Never use raw DocumentData, always convert to typed models
  ```typescript
  // ❌ Wrong - using raw Firestore data
  const userSnap = await getDoc(userRef)
  const data = userSnap.data() // This is untyped!
  
  // ✅ Correct - convert to typed model
  const userSnap = await getDoc(userRef)
  if (userSnap.exists()) {
    const user: User = {
      id: userSnap.id,
      email: userSnap.data().email || '',
      displayName: userSnap.data().displayName || null,
      // ... map all fields with proper types and defaults
    }
  }
  ```
- **Use Managers When Available**: Prefer manager classes over direct Firestore queries
  ```typescript
  // ✅ Preferred - managers handle conversion
  const user = await userManager.getById(userId)
  
  // ⚠️ Avoid - direct query requires manual conversion
  const userDoc = await getDoc(doc(db, 'users', userId))
  ```
- **Loading Pattern**:
  ```typescript
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [data, setData] = useState<User | null>(null) // Typed state!
  
  useEffect(() => {
    fetchData()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])
  ```

### Navigation Patterns
- **Programmatic**: Use `router.push()` from `next/navigation`
- **Links in Sidebar**: Use Next.js `<Link>` component
- **External Links**: Add `target="_blank" rel="noopener noreferrer"`

## What NOT to Do

### Avoid These Patterns
1. **No Server Components**: Don't remove `'use client'` directives
2. **No API Routes**: Don't create `/app/api` routes - use Firebase directly
3. **No New Icon Libraries**: Use lucide-react exclusively
4. **No CSS Files**: Don't create `.css` or `.module.css` files
5. **No Default Exports**: Use named exports for all components
6. **No Global State**: Keep state local or use Context sparingly
7. **No Custom Fetch Wrappers**: Use Firebase SDK methods directly
8. **No Env Vars Without Prefix**: All must start with `NEXT_PUBLIC_`

### Common Mistakes to Avoid
- Don't forget to add new pages to the sidebar navigation
- Don't hardcode colors - use theme CSS variables
- Don't skip loading states - every async operation needs feedback
- Don't use `any` type - define proper interfaces
- Don't commit `.env.local` file
- Don't forget `isActive` prop on sidebar menu items
- Don't use regular `<a>` tags for internal navigation

## Commit Style Guidelines

**Note: Only apply these rules when explicitly asked to "commit"**

When explicitly asked to commit changes:
- Generate commit messages automatically based on staged changes without additional user confirmation
- Commit all changes in a single commit
- Keep commit messages short - only a few words long
- Do NOT include "Co-Authored-By" or any references to Claude/AI in commit messages

### Commit Message Format:
- `[Feature] Add some button` - For new functionality or components
- `[Bug] Fix some bug` - For bug fixes and corrections  
- `[Clean] Refactored some code` - For refactoring, cleanup, or code improvements

### Examples:
- `[Feature] Add user dashboard`
- `[Bug] Fix login validation`
- `[Clean] Refactor project manager`