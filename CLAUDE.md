# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Quaestio

A traditional Catholic AI chatbot grounded in the perennial Magisterium, powered by the Magisterium API. It offers two modes: standard Catholic theological responses, and "Aquinas Mode" which formats answers in scholastic disputatio format (Videtur quod, Sed contra, Respondeo).

## Commands

```bash
# Development
npm run dev          # Start Next.js + Convex dev servers (run in two terminals or use npx convex dev in one)
npx convex dev       # Start Convex backend (generates types, syncs schema)

# Build & Deploy
npm run build        # Production build
npm run lint         # ESLint
vercel               # Deploy to Vercel
```

## Architecture

### Data Flow
1. **Session**: Browser-based session ID stored in localStorage (`use-session.ts`)
2. **Auth**: Simple password gate via middleware cookie (`quaestio-auth`)
3. **Chat**: Vercel AI SDK streams from `/api/chat` → Magisterium API
4. **Persistence**: Messages saved to Convex after streaming completes

### Key Integration Points

**Magisterium API** (`lib/magisterium.ts`):
- OpenAI-compatible API at `https://www.magisterium.com/api`
- Model: `magisterium-1`
- Uses `@ai-sdk/openai-compatible` for streaming

**Convex** (`convex/`):
- Schema: conversations, messages, usage (daily limits)
- Queries/mutations use session ID for multi-tenancy
- Types excluded from tsconfig, generated via `npx convex dev`

**Chat Modes** (`lib/system-prompts.ts`):
- `standard`: Traditional Catholic terminology, pre-Vatican II sources
- `aquinas`: Scholastic format (Objections → Sed Contra → Respondeo → Replies)

### Component Hierarchy
```
app/layout.tsx
└── providers/convex-provider.tsx  (Convex client)
    └── app/chat/[id]/page.tsx
        └── components/chat/chat-container.tsx
            ├── useChat() hook (AI SDK streaming)
            └── Convex mutations (persistence)
```

## Environment Variables

```bash
NEXT_PUBLIC_CONVEX_URL=    # Auto-set by npx convex dev
SITE_PASSWORD=             # Password gate for alpha access
MAGISTERIUM_API_KEY=       # sk_xxx from Magisterium
```

## Conventions

- UI components from shadcn/ui in `components/ui/`
- Convex functions use `as any` casts due to generated type timing issues during development
- Daily message limit: 25 per session (tracked in `convex/usage.ts`)
- Soft deletes for conversations (`isDeleted` flag)
