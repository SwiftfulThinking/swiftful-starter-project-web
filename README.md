# Swiftful Starter Project Web

Next.js starter template with Firebase, shadcn/ui, and OpenAI integration.

## Tech Stack

- **Next.js 15.3.4** - React framework with App Router
- **TypeScript 5.x** - Type safety with strict mode
- **Tailwind CSS 3.4.1** - Utility-first CSS
- **shadcn/ui** - All 46 components pre-installed
- **Firebase** - Auth, Firestore, Storage
- **OpenAI** - Chat & Reasoning APIs
- **Lottie** - Animations support
- **React Player** - Video playback

## Quick Start

### 1. Create New Project
```bash
./rename_project.sh "Your Project Name"
cd ../your-project-name
npm install
```

### 2. Firebase Setup

1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication > Google provider
3. Create Firestore database (production mode)
4. Enable Storage
5. Get config from Project Settings > General > Your apps > Web app

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## OpenAI Models

Supports two API types:
- **Chat Models**: gpt-3.5-turbo, gpt-4, gpt-4-turbo
- **Reasoning Models**: o1-preview, o1-mini, o3, o3-mini

Manager automatically routes to correct endpoint based on model selection.

## AI Assistant Support

### Claude Code
Full project context in `CLAUDE.md` - automatically loaded when using claude.ai/code

### Cursor AI
Comprehensive rules in:
- `.cursor/rules/` - Modern MDC format rules
- `.cursorrules` - Legacy format for compatibility

Both AI assistants will follow project conventions automatically.

## Key Features

- 🎨 4 pre-built themes with dark mode
- 🔐 Google SSO + anonymous auth
- 📁 File upload to Firebase Storage
- 🤖 Dual OpenAI API support
- 📱 Fully responsive design
- ⚡ Production-ready TypeScript

## What's Included

### Pages
- **Landing** (`/`) - Public page with Google SSO button
- **Home** (`/home`) - Protected dashboard with sidebar navigation
- **Components** (`/components`) - All 48 UI components showcase
- **Profile** (`/profile`) - User data from Firestore
- **OpenAI** (`/openai`) - AI chat interface with model switching

### Architecture
All data flows through manager classes:
```
Component → Manager → Firebase/OpenAI
         ↓
    Type Safety
```
- **Managers**: Singleton classes handling all external operations
- **Models**: TypeScript interfaces for data validation
- **No API Routes**: Direct client-side Firebase SDK usage

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Run ESLint
```