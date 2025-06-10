# AI Chatbot with React + TypeScript + Vite

A professional AI chatbot built with React, TypeScript, and Vite, featuring a polished chat interface powered by shadcn-chatbot-kit and OpenAI integration.

## Features

- 💬 **Professional chat interface** with shadcn-chatbot-kit components
- 🤖 **OpenAI GPT-3.5 Turbo integration** via Vercel's AI SDK  
- ✨ **Rich message rendering** with markdown support
- 📋 **Copy message functionality** with one-click copying
- 🎙️ **Audio recording capabilities** (ready to extend)
- 📎 **File attachment support** (ready to extend)
- ⚡ **Auto-scroll and smooth animations** 
- 🎨 **Beautiful UI** with Tailwind CSS and Framer Motion
- 📱 **Fully responsive design**

## Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env` file and add your OpenAI API key:

   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling and development
- **Tailwind CSS v4** for styling
- **Vercel AI SDK** for OpenAI integration
- **shadcn/ui** for base UI components
- **shadcn-chatbot-kit** for professional chat interface
- **Framer Motion** for smooth animations
- **react-markdown** for rich message rendering
- **Sonner** for toast notifications

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production  
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm fix` - Run all checks and build
- `pnpm ui` - Add shadcn/ui components

### Adding New Chat Components

This project uses [shadcn-chatbot-kit](https://shadcn-chatbot-kit.vercel.app/) for the chat interface. To add new chat components:

```bash
pnpm ui add https://shadcn-chatbot-kit.vercel.app/r/[component].json
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
