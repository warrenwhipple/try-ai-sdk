# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application featuring a professional AI chatbot with shadcn-chatbot-kit components, Vercel's AI SDK, and OpenAI integration. The project uses pnpm as the package manager.

## Essential Commands

### Development
- `pnpm dev` - Start Vite development server with hot module replacement
- `pnpm preview` - Preview production build locally

### Code Quality
- `pnpm fix` - Run all checks and build (format, typecheck, lint, build)
- `pnpm fix:fast` - Run quick checks without build (format, typecheck, lint)
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking without emitting files
- `pnpm format` - Format code with Prettier
- `pnpm build` - Type check and build for production

### Component Management
- `pnpm ui` - Run shadcn CLI to add/manage UI components
- Add chat components: `pnpm ui add https://shadcn-chatbot-kit.vercel.app/r/[component].json`

## Architecture

### Build System
- **Vite** with React plugin for fast development and optimized builds
- **TypeScript** with project references (tsconfig.app.json for app code, tsconfig.node.json for config files)
- **Path alias**: `@/*` maps to `./src/*`

### UI Framework
- **Tailwind CSS v4** integrated via Vite plugin
- **shadcn/ui** base components stored in `src/components/ui/`
- **shadcn-chatbot-kit** professional chat components integrated
- **Framer Motion** for animations and transitions
- Component variants managed with `class-variance-authority`
- Utility functions in `src/lib/utils.ts` for class merging

### Code Standards
- ESLint configured for React hooks and refresh rules
- Prettier for consistent formatting
- TypeScript strict mode enabled via project references
- **Linting exceptions**: UI components in `src/components/ui/` have relaxed linting rules for external libraries

### AI Integration
- **Vercel AI SDK** for OpenAI integration (`ai` and `@ai-sdk/openai` packages)
- **Environment variables**: `VITE_OPENAI_API_KEY` required for OpenAI API access
- **Chat component**: `src/components/Chat.tsx` integrates AI logic with shadcn-chatbot-kit UI
- **Model**: Currently configured to use GPT-3.5 Turbo
- **Message types**: Uses chat-message Message interface for compatibility
- **Features**: Supports markdown rendering, copy functionality, auto-scroll, animations

### Chat Component Integration
- **Main component**: Uses shadcn-chatbot-kit `Chat` component for professional UI
- **Message handling**: Custom logic adapts AI SDK messages to chat-kit format
- **State management**: Maintains messages, input, and loading states manually
- **Extensible**: Ready for file attachments, prompt suggestions

## Important Reminders and Conventions

### Naming Conventions
- Use lowercase kebab case for folders and file names: `src/components/my-component.tsx`
- Export React components by name: `export function MyComponent() { ... }`
- Do **not** export React component as file `default`

### Code Checks
`pnpm fix` quickly runs formatting fixes and all checks in one command that bails early for faster feedback.
**Always run `pnpm fix` when:**
- You complete implementing a feature
- Before creating any git commit

