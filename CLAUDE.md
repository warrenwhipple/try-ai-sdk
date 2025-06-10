# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application with Tailwind CSS and shadcn/ui components. The project includes a minimal AI chatbot built with Vercel's AI SDK and OpenAI integration. The project uses pnpm as the package manager.

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

## Important Reminders

**Always run `pnpm fix` when:**
- You complete implementing a feature
- Before creating any git commit

This ensures code quality, proper formatting, type safety, and that the build succeeds.

## Architecture

### Build System
- **Vite** with React plugin for fast development and optimized builds
- **TypeScript** with project references (tsconfig.app.json for app code, tsconfig.node.json for config files)
- **Path alias**: `@/*` maps to `./src/*`

### UI Framework
- **Tailwind CSS v4** integrated via Vite plugin
- **shadcn/ui** components stored in `src/components/ui/`
- Component variants managed with `class-variance-authority`
- Utility functions in `src/lib/utils.ts` for class merging

### Code Standards
- ESLint configured for React hooks and refresh rules
- Prettier for consistent formatting
- TypeScript strict mode enabled via project references

### AI Integration
- **Vercel AI SDK** for OpenAI integration (`ai` and `@ai-sdk/openai` packages)
- **Environment variables**: `VITE_OPENAI_API_KEY` required for OpenAI API access
- **Chat component**: `src/components/Chat.tsx` provides the main chatbot interface
- **Model**: Currently configured to use GPT-3.5 Turbo