# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. It uses Claude AI to generate React components in a virtual file system with real-time preview capabilities.

## Commands

### Development
```bash
npm run dev                 # Start Next.js dev server with Turbopack
npm run dev:daemon         # Run dev server in background, logs to logs.txt
npm run build              # Build for production
npm run start              # Start production server
```

### Database
```bash
npm run setup              # Install deps + generate Prisma client + run migrations
npm run db:reset           # Reset database (drops all data)
npx prisma studio          # Open Prisma Studio GUI
npx prisma generate        # Regenerate Prisma client after schema changes
npx prisma migrate dev     # Create and apply new migrations
```

### Testing & Linting
```bash
npm run test               # Run all tests with Vitest
npm run lint               # Run ESLint
```

## Architecture

### Virtual File System

The core of UIGen is a **VirtualFileSystem** (`src/lib/file-system.ts`) that manages all generated files in-memory:
- Files are stored as a tree of `FileNode` objects with paths, content, and children
- No files are written to disk; everything exists in memory
- Supports standard operations: create, read, update, delete, rename
- Serializable to/from JSON for database persistence
- Used by both the AI tools and the preview system

### AI Component Generation Flow

1. **Chat API** (`src/app/api/chat/route.ts`):
   - Receives messages and current file system state
   - Injects system prompt from `src/lib/prompts/generation.tsx`
   - Uses Vercel AI SDK's `streamText` with Claude (or mock provider if no API key)
   - Provides two AI tools: `str_replace_editor` and `file_manager`

2. **AI Tools**:
   - `str_replace_editor` (`src/lib/tools/str-replace.ts`): Create, view, and edit files with string replacement
   - `file_manager` (`src/lib/tools/file-manager.ts`): Rename/move and delete files/folders

3. **Provider System** (`src/lib/provider.ts`):
   - Switches between real Claude API and MockLanguageModel based on `ANTHROPIC_API_KEY`
   - MockLanguageModel generates static components (Counter, ContactForm, Card) for demo purposes
   - Uses Claude Haiku 4.5 when API key is present

### Preview System

The live preview works by transforming JSX/TSX to browser-executable JavaScript:

1. **JSX Transformation** (`src/lib/transform/jsx-transformer.ts`):
   - Uses `@babel/standalone` to transpile JSX/TSX to JavaScript in the browser
   - Creates import maps mapping `@/` alias to blob URLs
   - External libraries (React, etc.) map to CDN URLs (esm.sh)
   - CSS imports are extracted and injected as `<style>` tags

2. **Preview Frame** (`src/components/preview/PreviewFrame.tsx`):
   - Renders an iframe with transformed code
   - Auto-detects entry point (`/App.jsx`, `/App.tsx`, etc.)
   - Injects import map and transformed modules
   - Hot-reloads on file system changes via `refreshTrigger`

### State Management

The app uses React Context for global state:

1. **FileSystemContext** (`src/lib/contexts/file-system-context.tsx`):
   - Wraps VirtualFileSystem instance
   - Provides file operations to components
   - Handles AI tool calls by applying them to the file system
   - Triggers re-renders when files change

2. **ChatContext** (`src/lib/contexts/chat-context.tsx`):
   - Manages chat messages and streaming state
   - Coordinates between chat UI and file system updates

### Authentication & Persistence

- **Auth** (`src/lib/auth.ts`): JWT-based authentication with HTTP-only cookies
- **Middleware** (`src/middleware.ts`): Protects API routes requiring authentication
- **Anonymous Work Tracking** (`src/lib/anon-work-tracker.ts`):
  - Uses sessionStorage to track anonymous user work
  - Prompts login when anonymous users create content
  - Preserves work during signup/login flow

### Database Schema

The database schema is defined in `prisma/schema.prisma`. Reference it anytime you need to understand the structure of the data stored in the database.

Prisma with SQLite:
- **User**: id, email, password (bcrypt hashed), timestamps
- **Project**: id, name, userId (optional), messages (JSON), data (JSON), timestamps
- Projects store serialized VirtualFileSystem state in `data` field
- Messages stored as JSON array for conversation history
- Prisma client generated to `src/generated/prisma/`

### Key Constraints

1. **Entry Point**: Every project must have a root `/App.jsx` file as the entry point
2. **Import Alias**: All local imports use `@/` prefix (e.g., `import Foo from '@/components/Foo'`)
3. **Styling**: Use Tailwind CSS classes, not inline styles
4. **No HTML Files**: The system only works with JSX/TSX React components
5. **Virtual Root**: File system operates on virtual root `/`, not traditional OS paths

### Testing

- Vitest with React Testing Library and jsdom
- Test files located next to source files in `__tests__/` directories
- Tests cover chat components, file tree, and core utilities

## Code Style

- Use comments sparingly. Only comment complex code.
