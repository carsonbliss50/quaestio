# Quaestio

A traditional Catholic AI chatbot grounded in the perennial Magisterium. Powered by the Magisterium API.

## Features

- **Traditional Catholic Theology**: Answers rooted in pre-Vatican II sources
- **Aquinas Mode**: Scholastic disputatio format (Videtur quod, Sed contra, Respondeo)
- **Chat History**: Persistent conversations with real-time sync
- **Dark/Light Mode**: Cathedral dark and warm parchment themes

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Convex

Create a Convex project and deploy the schema:

```bash
npx convex dev
```

This will:
- Create a Convex project (follow prompts)
- Generate proper TypeScript types in `convex/_generated/`
- Update `.env.local` with your Convex URL

### 3. Set environment variables

Edit `.env.local`:

```bash
# Convex (auto-filled by npx convex dev)
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Password for alpha access
SITE_PASSWORD=your-password-here

# Magisterium API key
MAGISTERIUM_API_KEY=sk_your_key_here
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 15** (App Router)
- **shadcn/ui** + **Tailwind CSS**
- **Convex** (real-time database)
- **Vercel AI SDK** (streaming chat)
- **Magisterium API** (Catholic knowledge base)

## Project Structure

```
quaestio/
├── app/
│   ├── api/chat/       # Streaming chat endpoint
│   ├── api/auth/       # Password authentication
│   ├── chat/[id]/      # Conversation pages
│   └── login/          # Password gate
├── components/
│   ├── chat/           # Chat UI components
│   ├── sidebar/        # Conversation history
│   └── ui/             # shadcn components
├── convex/             # Database schema & queries
├── hooks/              # React hooks
└── lib/                # System prompts, utilities
```

## Deployment

Deploy to Vercel:

```bash
vercel
```

Set the same environment variables in your Vercel project settings.

## Notes

- Consult a priest for important matters of faith and morals
- Daily message limit: 25 messages per user
- Citations from traditional sources included in responses
