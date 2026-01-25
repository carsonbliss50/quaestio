---
title: "feat: Quaestio v2 Feature Set"
type: feat
date: 2026-01-24
status: draft
---

# Quaestio v2 Feature Set

## Overview

Comprehensive feature rollout to transform Quaestio from alpha prototype to polished Catholic AI chatbot. Implements 7 features across 3 phases: Core Infrastructure, UX Polish, and Growth.

**Target:** Thorough implementation over weeks, not days.
**Stage:** Alpha (password-gated)
**Scope:** 7 features, ~15-20 files modified/created

## Problem Statement

Current Quaestio limitations:
1. **Citations lost** - Magisterium API returns source references but they're never captured or displayed
2. **Poor message rendering** - No markdown parsing, code blocks, or formatting
3. **Missing table-stakes UX** - No copy button, no regenerate, awkward mobile experience
4. **No virality** - Can't share interesting theological Q&A with others

## Proposed Solution

Three-phase implementation with dependencies managed:

```
Phase 1: Core Infrastructure
├── #9 Capture citations from API ──┐
│                                   ├──► #1 Improve citation display
└── #8 Add markdown rendering ──────┘

Phase 2: UX Polish
├── #7 Add copy button
├── #3 Add regenerate response
└── #6 Improve mobile UX

Phase 3: Growth
└── #4 Add shareable conversation links
```

---

## Technical Approach

### Phase 1: Core Infrastructure

#### Task #9: Capture Citations from Magisterium API

**Goal:** Extract the `citations` array from Magisterium API streaming responses.

**Magisterium Citation Format** (per their docs):
```json
{
  "object": "chat.completion",
  "citations": [
    {
      "cited_text": "The quoted passage...",
      "cited_text_heading": "Section Title",
      "document_title": "Catechism of the Catholic Church",
      "document_author": "Holy See",
      "document_year": "1992",
      "document_reference": "1234",
      "source_url": "https://..."
    }
  ]
}
```

**When streaming:** Citations appear only in **final chunk** with `finish_reason: "stop"`.

**Implementation:**

1. **Add MetadataExtractor to Magisterium provider**

```typescript
// lib/magisterium.ts
import { createOpenAICompatible, type MetadataExtractor } from "@ai-sdk/openai-compatible";

export interface MagisteriumCitation {
  cited_text: string;
  cited_text_heading: string | null;
  document_title: string | null;
  document_author: string | null;
  document_year: string | null;
  document_reference: string | null;
  source_url: string;
}

const magisteriumMetadataExtractor: MetadataExtractor = {
  extractMetadata: ({ parsedBody }) => ({
    magisterium: { citations: parsedBody.citations ?? [] },
  }),

  createStreamExtractor: () => {
    let citations: MagisteriumCitation[] = [];

    return {
      processChunk: (parsedChunk) => {
        if (parsedChunk.citations) {
          citations = parsedChunk.citations;
        }
      },
      buildMetadata: () => ({ magisterium: { citations } }),
    };
  },
};

export const magisterium = createOpenAICompatible({
  name: "magisterium",
  baseURL: "https://www.magisterium.com/api/v1",
  headers: { Authorization: `Bearer ${process.env.MAGISTERIUM_API_KEY}` },
  metadataExtractor: magisteriumMetadataExtractor,
});
```

2. **Update API route to send citations as custom data**

```typescript
// app/api/chat/route.ts
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText
} from "ai";

export async function POST(req: Request) {
  const { messages, mode = "standard" } = await req.json();

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = streamText({
        model: magisterium(MAGISTERIUM_MODEL),
        system: getSystemPrompt(mode),
        messages,
        onFinish: ({ providerMetadata }) => {
          const citations = providerMetadata?.magisterium?.citations ?? [];
          if (citations.length) {
            writer.write({
              type: 'data-citations',
              data: { citations }
            });
          }
        },
      });
      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
```

3. **Update client to receive and persist citations**

```typescript
// components/chat/chat-container.tsx
const [pendingCitations, setPendingCitations] = useState<Citation[]>([]);

const { messages, append, isLoading, stop } = useChat({
  api: "/api/chat",
  body: { mode },
  onData: (dataPart) => {
    if (dataPart.type === 'data-citations') {
      // Transform Magisterium format to our schema
      const citations = dataPart.data.citations.map((c: MagisteriumCitation) => ({
        title: c.document_title ?? "Source",
        source: c.cited_text,
        url: c.source_url,
      }));
      setPendingCitations(citations);
    }
  },
  onFinish: async (message) => {
    await addAssistantMessage({
      conversationId,
      content: message.content,
      citations: pendingCitations.length ? pendingCitations : undefined,
    });
    setPendingCitations([]);
  },
});
```

**Files to modify:**
- `lib/magisterium.ts` - Add MetadataExtractor
- `app/api/chat/route.ts` - Use createUIMessageStream
- `components/chat/chat-container.tsx` - Handle onData callback

**Verification:**
- [ ] Send message, confirm citations appear in Convex dashboard
- [ ] Verify citations display on page refresh (persistence works)

---

#### Task #8: Add Markdown Rendering

**Goal:** Parse and render markdown in assistant responses.

**Supported features:**
- Headers (h1-h6)
- Bold, italic, strikethrough
- Ordered and unordered lists
- Code blocks with syntax highlighting (for Latin quotes)
- Blockquotes
- Links (open in new tab)
- **No:** raw HTML, images

**Implementation:**

1. **Install dependencies**

```bash
npm install react-markdown remark-gfm
```

2. **Create markdown renderer component**

```typescript
// components/chat/markdown-content.tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "prose-headings:font-display prose-headings:text-foreground",
        "prose-p:text-foreground prose-p:leading-relaxed",
        "prose-a:text-gold prose-a:no-underline hover:prose-a:underline",
        "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
        "prose-blockquote:border-l-gold prose-blockquote:italic",
        className
      )}
      components={{
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        // Strip raw HTML for security
        // @ts-expect-error - intentionally removing HTML elements
        script: () => null,
        style: () => null,
        iframe: () => null,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
```

3. **Update message-item to use markdown renderer**

```typescript
// components/chat/message-item.tsx
import { MarkdownContent } from "./markdown-content";

// Replace the plain text div with:
{role === "assistant" ? (
  <MarkdownContent content={content} />
) : (
  <div className="whitespace-pre-wrap leading-relaxed text-foreground">
    {content}
  </div>
)}

// Streaming cursor handled separately
{isStreaming && (
  <span className="inline-block w-1.5 h-5 ml-1 bg-gold rounded-sm animate-blink" />
)}
```

**Files to create:**
- `components/chat/markdown-content.tsx`

**Files to modify:**
- `components/chat/message-item.tsx`
- `package.json` (new deps)

**Verification:**
- [ ] Send "What are the **beatitudes**?" - bold renders
- [ ] Send "List the 10 commandments" - numbered list renders
- [ ] Aquinas mode blockquotes render properly

---

#### Task #1: Improve Citation Display

**Goal:** Better visual treatment of Magisterium source references.

**Improvements:**
- Show document type icon (Catechism, Encyclical, Council Document, etc.)
- Display document year if available
- Truncate long cited_text with expand button
- Collapsible citations section for mobile

**Implementation:**

```typescript
// components/chat/citation-card.tsx (enhanced)
"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, Book, Scroll, Church } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationCardProps {
  title: string;
  source: string;
  url?: string;
  year?: string;
  index?: number;
}

function getDocumentIcon(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("catechism")) return Book;
  if (lower.includes("encyclical") || lower.includes("letter")) return Scroll;
  if (lower.includes("council") || lower.includes("vatican")) return Church;
  return Book;
}

export function CitationCard({ title, source, url, year, index }: CitationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = getDocumentIcon(title ?? "");
  const isLong = source.length > 200;

  return (
    <div className="rounded-md border border-border bg-card">
      <div
        className={cn(
          "flex items-start gap-3 p-3 text-sm",
          url && "cursor-pointer hover:bg-muted transition-colors"
        )}
        onClick={() => url && window.open(url, "_blank")}
      >
        {index && (
          <span className="flex-shrink-0 w-6 h-6 rounded bg-muted text-xs flex items-center justify-center text-muted-foreground font-medium">
            {index}
          </span>
        )}
        <Icon className="flex-shrink-0 w-4 h-4 text-gold mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground truncate">{title}</p>
            {year && (
              <span className="text-xs text-muted-foreground">({year})</span>
            )}
          </div>
          <p className={cn(
            "text-sm text-muted-foreground mt-1",
            !expanded && isLong && "line-clamp-2"
          )}>
            {source}
          </p>
          {isLong && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="text-xs text-gold mt-1 flex items-center gap-1"
            >
              {expanded ? "Show less" : "Show more"}
              <ChevronDown className={cn("w-3 h-3", expanded && "rotate-180")} />
            </button>
          )}
        </div>
        {url && <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
      </div>
    </div>
  );
}
```

**Files to modify:**
- `components/chat/citation-card.tsx`
- `convex/schema.ts` - Add optional `year` field to citations

**Verification:**
- [ ] Citations show appropriate icons
- [ ] Long citations truncate with "Show more"
- [ ] Clicking opens source URL

---

### Phase 2: UX Polish

#### Task #7: Add Copy Button

**Goal:** Copy assistant response to clipboard with attribution.

**Behavior:**
- Visible on all assistant messages
- Disabled during streaming
- Copies: message content + "— via Quaestio"
- Toast confirmation on success

**Implementation:**

```typescript
// components/chat/copy-button.tsx
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CopyButtonProps {
  content: string;
  disabled?: boolean;
}

export function CopyButton({ content, disabled }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${content}\n\n— via Quaestio`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleCopy}
      disabled={disabled}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </Button>
  );
}
```

**Update message-item.tsx:**

```typescript
// Add group class and copy button
<div className="flex gap-4 w-full animate-fade-in py-4 group">
  {/* ... existing content ... */}
  {role === "assistant" && (
    <div className="flex-shrink-0">
      <CopyButton content={content} disabled={isStreaming} />
    </div>
  )}
</div>
```

**Files to create:**
- `components/chat/copy-button.tsx`

**Files to modify:**
- `components/chat/message-item.tsx`

---

#### Task #3: Add Regenerate Response

**Goal:** Retry the last assistant response.

**Behavior:**
- Button on last assistant message only
- Counts against daily limit (per business decision)
- Deletes old response, streams new one
- Disabled during active streaming

**Implementation:**

1. **Add delete mutation to Convex**

```typescript
// convex/messages.ts
export const deleteLastAssistant = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("desc")
      .take(1);

    const lastMessage = messages[0];
    if (lastMessage?.role === "assistant") {
      await ctx.db.delete(lastMessage._id);
      return lastMessage._id;
    }
    return null;
  },
});
```

2. **Create regenerate button component**

```typescript
// components/chat/regenerate-button.tsx
"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegenerateButtonProps {
  onRegenerate: () => void;
  disabled?: boolean;
}

export function RegenerateButton({ onRegenerate, disabled }: RegenerateButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={onRegenerate}
      disabled={disabled}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
      title="Regenerate response"
    >
      <RefreshCw className="w-3.5 h-3.5" />
    </Button>
  );
}
```

3. **Update chat-container.tsx:**

```typescript
const deleteLastAssistant = useMutation(api.messages.deleteLastAssistant as any);

const handleRegenerate = async () => {
  if (!canSend) {
    toast.error("Daily message limit reached");
    return;
  }

  // Get last user message
  const lastUserMessage = [...displayMessages].reverse().find(m => m.role === "user");
  if (!lastUserMessage) return;

  // Delete last assistant message
  await deleteLastAssistant({ conversationId });

  // Increment usage (counts against limit)
  await increment();

  // Resend last user message
  await append({ role: "user", content: lastUserMessage.content });
};
```

**Files to create:**
- `components/chat/regenerate-button.tsx`

**Files to modify:**
- `convex/messages.ts`
- `components/chat/chat-container.tsx`
- `components/chat/message-item.tsx`

---

#### Task #6: Improve Mobile UX

**Goal:** Better sidebar and navigation on mobile devices.

**Issues to fix:**
1. Sidebar doesn't auto-close after navigation
2. Touch targets too small
3. Safe area insets not respected

**Implementation:**

1. **Auto-close sidebar on navigation**

```typescript
// components/sidebar/sidebar.tsx
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();

  // Auto-close on route change (mobile)
  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  // ... rest of component
}
```

2. **Increase touch targets**

```typescript
// components/sidebar/conversation-item.tsx
// Change padding from p-2 to p-3 for 44px touch target
<button className="w-full p-3 text-left rounded-md hover:bg-muted">
```

3. **Add safe area padding**

```css
/* app/globals.css */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.safe-area-top {
  padding-top: env(safe-area-inset-top, 0);
}
```

4. **Apply to chat input**

```typescript
// components/chat/chat-input.tsx
<div className="p-4 border-t border-border bg-background safe-area-bottom">
```

**Files to modify:**
- `components/sidebar/sidebar.tsx`
- `components/sidebar/conversation-item.tsx`
- `components/chat/chat-input.tsx`
- `app/globals.css`

---

### Phase 3: Growth

#### Task #4: Add Shareable Conversation Links

**Goal:** Public URLs to view conversations without authentication.

**Schema changes required:**

```typescript
// convex/schema.ts
conversations: defineTable({
  // ...existing fields
  isPublic: v.optional(v.boolean()),
  shareToken: v.optional(v.string()),
})
  .index("by_share_token", ["shareToken"])
```

**Implementation:**

1. **Add share mutations to Convex**

```typescript
// convex/conversations.ts
import { v4 as uuidv4 } from "uuid";

export const toggleShare = mutation({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.id);
    if (!conversation) throw new Error("Not found");

    if (conversation.isPublic) {
      // Unshare - remove token
      await ctx.db.patch(args.id, {
        isPublic: false,
        shareToken: undefined
      });
      return null;
    } else {
      // Share - generate token
      const token = uuidv4();
      await ctx.db.patch(args.id, {
        isPublic: true,
        shareToken: token
      });
      return token;
    }
  },
});

export const getByShareToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("by_share_token", (q) => q.eq("shareToken", args.token))
      .take(1);

    const conversation = conversations[0];
    if (!conversation?.isPublic) return null;
    return conversation;
  },
});
```

2. **Create share route (bypasses auth)**

```typescript
// app/share/[token]/page.tsx
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { ShareView } from "@/components/share/share-view";

export default async function SharePage({
  params
}: {
  params: { token: string }
}) {
  const conversation = await fetchQuery(api.conversations.getByShareToken, {
    token: params.token,
  });

  if (!conversation) notFound();

  return <ShareView conversationId={conversation._id} />;
}
```

3. **Update middleware to allow share routes**

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Skip auth for share routes
  if (request.nextUrl.pathname.startsWith("/share/")) {
    return NextResponse.next();
  }

  // ... existing auth logic
}
```

4. **Create ShareView component** (read-only message list)

5. **Add share button to conversation header**

**Files to create:**
- `app/share/[token]/page.tsx`
- `components/share/share-view.tsx`
- `components/share/share-button.tsx`

**Files to modify:**
- `convex/schema.ts`
- `convex/conversations.ts`
- `middleware.ts`
- `components/chat/chat-container.tsx` (add share button)

---

## Acceptance Criteria

### Functional Requirements

#### Phase 1
- [ ] Citations from Magisterium API are captured and persisted to Convex
- [ ] Citations display with document icons, expand/collapse for long text
- [ ] Markdown renders in assistant messages (headers, lists, bold, code, links)
- [ ] User messages remain plain text

#### Phase 2
- [ ] Copy button appears on hover for assistant messages
- [ ] Copying includes message + "— via Quaestio" attribution
- [ ] Regenerate button on last assistant message only
- [ ] Regenerate counts against daily limit
- [ ] Mobile sidebar auto-closes on navigation
- [ ] Touch targets meet 44px minimum

#### Phase 3
- [ ] Share button generates public link
- [ ] Share link works without authentication
- [ ] Unsharing immediately revokes access
- [ ] Shared view is read-only

### Non-Functional Requirements

- [ ] No regressions to existing chat functionality
- [ ] Streaming performance unchanged
- [ ] Mobile layout works on iPhone SE (smallest common screen)
- [ ] Works in Safari, Chrome, Firefox

---

## Implementation Order

```
Week 1:
  - #9 Capture citations from API
  - #8 Add markdown rendering

Week 2:
  - #1 Improve citation display
  - #7 Add copy button

Week 3:
  - #3 Add regenerate response
  - #6 Improve mobile UX

Week 4:
  - #4 Add shareable conversation links
  - Testing and polish
```

---

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| Magisterium API citation format differs from docs | High | Test with real API before full implementation |
| MetadataExtractor not available in current AI SDK version | Medium | Check package version, may need upgrade |
| Share links indexed by search engines | Medium | Add noindex meta tag to share pages |
| Mobile Safari clipboard API issues | Low | Fallback to document.execCommand |

---

## Dependencies

**New npm packages:**
- `react-markdown` - Markdown rendering
- `remark-gfm` - GitHub Flavored Markdown support
- `uuid` - Share token generation

**Convex schema migration:**
- Add `isPublic`, `shareToken` to conversations
- Add optional `year` to citations

---

## Outstanding Tasks (Future Work)

The following tasks were identified during v2 development for future implementation:

### Task #10: Collapsible Sidebar with Icon

**Goal:** Allow sidebar to collapse to icon-only mode for more screen real estate.

**Behavior:**
- Toggle button to collapse/expand sidebar
- Collapsed state shows only icons (new chat, conversation list items)
- Persists preference in localStorage
- Smooth animation on toggle

**Files to modify:**
- `components/sidebar/sidebar.tsx`
- `components/sidebar/conversation-item.tsx`
- `app/globals.css` (animation)

---

### Task #11: Source Library for Citations

**Problem:** Magisterium API returns `source_url` fields pointing to magisterium.com, but these links don't work for external users (require Magisterium account/subscription).

**Options to explore:**

1. **Build own document repository**
   - Scrape/collect Catholic documents (CCC, encyclicals, council docs)
   - Host on our own domain with permanent URLs
   - Map Magisterium citations to our sources
   - Significant infrastructure work

2. **Link to existing public sources**
   - Vatican.va has most documents publicly available
   - Map document titles to vatican.va URLs
   - Create lookup table for common documents
   - Less control but faster to implement

3. **Display citations without links**
   - Show citation text and metadata
   - Remove or gray out non-functional URLs
   - Users can search for documents themselves
   - Simplest but poorest UX

**Recommended approach:** Start with option 2 (vatican.va mapping) for common documents, fall back to option 3 for unmapped sources.

**Files to create:**
- `lib/source-mapping.ts` - Document title → vatican.va URL mapping
- `lib/scraper/` - (if option 1) Vatican document scraper

**Files to modify:**
- `components/chat/citation-card.tsx` - Use mapped URLs
- `app/api/chat/route.ts` - Transform citations before sending

---

### Task #12: Traditional (Pre-Vatican II) System Prompts

**Goal:** Enhance system prompts to produce responses in a more traditional Catholic style, emphasizing pre-Vatican II sources and language.

**Proposed changes:**

1. **Prioritize traditional sources**
   - Catechism of Trent over CCC
   - Pre-Vatican II encyclicals
   - Church Fathers and Doctors
   - Traditional Latin terminology

2. **Language and tone adjustments**
   - More formal ecclesiastical language
   - Latin phrases where appropriate (with translations)
   - Reference to traditional practices
   - Avoid modernist theological language

3. **Mode options**
   - Keep existing "standard" mode as-is
   - Enhance "aquinas" mode with scholastic rigor
   - Consider new "traditional" mode toggle

**Example prompt additions:**
```
When citing Church teaching:
- Prefer sources from before 1962 when available
- Use traditional theological terminology (e.g., "mortal sin" not "grave sin")
- Include Latin terms with English translations
- Reference the Catechism of the Council of Trent alongside the CCC
- Cite Church Fathers (Augustine, Aquinas, etc.) directly
```

**Files to modify:**
- `lib/system-prompts.ts` - Add traditional language directives
- `components/chat/mode-selector.tsx` - (optional) Add "Traditional" mode option

---

## References

### Internal
- `lib/magisterium.ts:1` - Current Magisterium client
- `components/chat/chat-container.tsx:39` - Current useChat implementation
- `convex/schema.ts:1` - Database schema
- `CLAUDE.md` - Project conventions

### External
- [Magisterium API Citation Docs](https://www.magisterium.com/developers/docs/chat/citations)
- [AI SDK: Streaming Custom Data](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data)
- [AI SDK: MetadataExtractor](https://ai-sdk.dev/providers/openai-compatible-providers)
- [react-markdown](https://github.com/remarkjs/react-markdown)
