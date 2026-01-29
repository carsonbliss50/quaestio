# Quaestio Premium Aesthetic Rebrand Plan

## Executive Summary

Transform Quaestio from a functional Catholic AI chatbot into a **premium, refined experience** inspired by Hallow's design philosophy. The rebrand focuses on:

- **Distinguished typography** with characterful serif fonts
- **Ultra-clean black/white palette** with restrained gold accents
- **Generous whitespace** and premium spatial composition
- **Subtle, confident animations** that feel unhurried
- **Elevated component design** with refined shadows and borders

**Critical constraint**: NO PURPLE anywhere in the design.

---

## 1. Typography System

### Current State
| Role | Font |
|------|------|
| Display (h1-h2) | STK Bureau Serif (local) |
| Serif (h3-h6) | Crimson Pro |
| Body | Inter |
| Mono | Geist Mono |

### Proposed Typography Stack

| Role | Current | Proposed | Rationale |
|------|---------|----------|-----------|
| **Display** | STK Bureau Serif | **Cormorant Garamond** (700) | Elegant serif with Catholic typography roots. Widely available via Google Fonts. |
| **Headings** | Crimson Pro | **Cormorant** (500, 600) | Unified serif family for cohesion |
| **Body** | Inter | **Source Serif 4** | Readable, refined serif for body text. Premium feel vs generic sans. |
| **UI/Labels** | Inter | **Inter** (keep) | Clean sans-serif for buttons, labels |
| **Mono** | Geist Mono | **JetBrains Mono** | More refined for code/references |

### Font Scale (Base: 16px)

```
xs:    0.75rem   (12px) - Labels, captions
sm:    0.875rem  (14px) - Secondary text, buttons
base:  1rem      (16px) - Body text
lg:    1.125rem  (18px) - Lead paragraphs
xl:    1.25rem   (20px) - H4
2xl:   1.5rem    (24px) - H3
3xl:   1.875rem  (30px) - H2
4xl:   2.25rem   (36px) - H1 mobile
5xl:   3rem      (48px) - H1 desktop
6xl:   3.75rem   (60px) - Hero display
```

### Typography Hierarchy

| Element | Font | Size | Weight | Tracking | Line Height |
|---------|------|------|--------|----------|-------------|
| Hero Display | Cormorant Garamond | 5xl-6xl | 700 | +0.02em | 1.1 |
| H1 | Cormorant Garamond | 4xl-5xl | 700 | +0.01em | 1.2 |
| H2 | Cormorant Garamond | 3xl | 600 | +0.01em | 1.25 |
| H3 | Cormorant | 2xl | 600 | normal | 1.3 |
| H4 | Cormorant | xl | 500 | normal | 1.4 |
| Body | Source Serif 4 | base | 400 | normal | 1.7 |
| UI Text | Inter | sm | 500 | +0.01em | 1.5 |
| Labels | Inter | xs | 600 | +0.05em | 1.4 |
| Buttons | Inter | sm | 600 | +0.02em | 1 |

---

## 2. Color System Overhaul

### Design Philosophy
- **Light mode**: Pure white backgrounds, deep black text, minimal visual noise
- **Dark mode**: Deep, rich blacks (not gray), cream/warm white text
- **Gold**: Used SPARINGLY for emphasis, icons, and interactive accents only
- **NO PURPLE**: Completely eliminated

### Light Theme Palette

```css
:root {
  /* Backgrounds */
  --background: #FFFFFF;           /* Pure white */
  --background-subtle: #FAFAFA;    /* Off-white for cards */
  --background-muted: #F5F5F5;     /* Muted backgrounds */

  /* Foregrounds */
  --foreground: #0A0A0A;           /* Near-black for text */
  --foreground-muted: #525252;     /* Muted text */
  --foreground-subtle: #737373;    /* Subtle text */

  /* Gold Accent (sparingly) */
  --gold: #B8972F;                 /* Deeper, more refined gold */
  --gold-light: #D4B84A;           /* Hover states */
  --gold-subtle: rgba(184, 151, 47, 0.1);

  /* Borders & Dividers */
  --border: #E5E5E5;
  --border-strong: #D4D4D4;

  /* Cards & Surfaces */
  --card: #FFFFFF;
  --card-shadow: rgba(0, 0, 0, 0.04);

  /* Interactive States */
  --primary: #0A0A0A;              /* Black buttons */
  --primary-foreground: #FFFFFF;
  --secondary: #F5F5F5;
  --secondary-foreground: #0A0A0A;

  /* Focus States */
  --ring: #B8972F;                 /* Gold focus ring */
}
```

### Dark Theme Palette

```css
.dark {
  /* Backgrounds - Deep, rich blacks */
  --background: #0A0A0A;           /* Near-black */
  --background-subtle: #141414;
  --background-muted: #1A1A1A;

  /* Foregrounds - Warm whites */
  --foreground: #FAFAF9;           /* Warm white (stone-50) */
  --foreground-muted: #A8A29E;     /* stone-400 */
  --foreground-subtle: #78716C;    /* stone-500 */

  /* Gold Accent */
  --gold: #D4B84A;                 /* Brighter for dark mode */
  --gold-light: #E8CC5E;
  --gold-subtle: rgba(212, 184, 74, 0.12);

  /* Borders */
  --border: #262626;
  --border-strong: #404040;

  /* Cards */
  --card: #141414;
  --card-shadow: rgba(0, 0, 0, 0.3);

  /* Interactive */
  --primary: #FAFAF9;              /* White buttons */
  --primary-foreground: #0A0A0A;
  --secondary: #262626;
  --secondary-foreground: #FAFAF9;
}
```

### Gold Accent Usage Rules

**USE gold for:**
1. Assistant avatar icon (Triangle)
2. Aquinas Mode indicator
3. Focus rings on interactive elements
4. Active/selected states (subtle background tint)
5. Citation icons
6. Streaming cursor
7. Occasional key emphasis

**DO NOT use gold for:**
- Large backgrounds
- Primary buttons (use black/white)
- Body text
- Headers (except specific emphasis)

---

## 3. Component Redesign Priority List

### Priority 1: High Impact (Core Experience)

#### 3.1 Homepage (`app/page.tsx`)

**Changes:**
- Redesign logo SVG (thinner lines, elegant geometry)
- Increase vertical spacing: `space-y-16` → `space-y-20`
- Make "Quaestio" headline larger with proper kerning
- Redesign mode cards:
  - Taller with more padding (`p-8`)
  - Larger icons with refined styling
  - Subtle hover shadow lift effect
  - Subtle border on hover
- Refined subtitle typography (Source Serif, larger)
- Staggered entrance animations

#### 3.2 Chat Input (`components/chat/chat-input.tsx`)

**Changes:**
- Replace `rounded-md` with `rounded-2xl`
- Add subtle inner shadow to container
- Redesign send button:
  - Circular shape (`rounded-full`)
  - Black fill (light mode) / white fill (dark mode)
  - Scale animation on hover
  - Gold tint on focus
- Italic, lighter placeholder text
- Intensifying border on focus
- Increased internal padding

#### 3.3 Message Item (`components/chat/message-item.tsx`)

**Changes:**
- Larger avatars (`w-10 h-10`)
- User avatar: refined outline style
- Assistant avatar: filled with subtle gold accent
- Increased avatar-to-content gap
- Subtle left border accent for assistant messages
- Action buttons in pill container on hover
- Refined gold streaming cursor

#### 3.4 Buttons (`components/ui/button.tsx`)

**Changes:**
- Increase border radius to `rounded-xl` (12px)
- Add subtle shadow to default variant
- Hover states: scale 1.02, shadow elevation, 200ms transition
- Active state: scale 0.98
- Light mode default: solid black fill, white text
- Refined gold variant: less saturated
- New "outline-subtle" variant

### Priority 2: Medium Impact

#### 3.5 Sidebar (`components/sidebar/sidebar.tsx`)

**Changes:**
- Increased header padding with subtle bottom border
- Full-width black New Chat button with `rounded-xl`
- "+" icon rotation on hover
- Increased conversation item spacing
- Add date grouping ("Today", "Yesterday", "This Week")
- Refined footer with more padding

#### 3.6 Conversation Item (`components/sidebar/conversation-item.tsx`)

**Changes:**
- `rounded-xl` border radius
- Active state: subtle gold left border accent
- Hover: background change + subtle scale
- Delete icon fade on hover

#### 3.7 Citation Card (`components/chat/citation-card.tsx`)

**Changes:**
- Hover lift effect with shadow
- More elegant icons
- Smooth height animation for expand/collapse
- Gold accent on link hover

#### 3.8 Mode Selector (`components/chat/mode-selector.tsx`)

**Changes:**
- Redesigned trigger with clear mode indication
- Gold accent for Aquinas mode
- Refined dropdown styling
- Smooth open/close animation

### Priority 3: Polish

#### 3.9-3.13 UI Components

- **Cards**: `rounded-2xl`, subtle shadow, generous padding
- **Input**: `rounded-xl`, inner shadow, h-12 height
- **Textarea**: Match input styling
- **Scroll Area**: Thinner scrollbar, gold-tinted thumb on hover
- **Dialog/Sheet**: `rounded-3xl`, backdrop blur, smooth animations

---

## 4. Spacing & Layout Updates

### Spacing Tokens

```css
--spacing-card-padding: 2rem;     /* 32px */
--spacing-section: 6rem;          /* 96px */
--spacing-block: 4rem;            /* 64px */
--spacing-inline: 1rem;           /* 16px */
--spacing-stack: 1.5rem;          /* 24px */
```

### Layout Improvements

| Area | Current | Proposed |
|------|---------|----------|
| Homepage max width | `max-w-xl` | `max-w-2xl` |
| Section spacing | `space-y-12` | `space-y-16` to `space-y-20` |
| Mode card padding | `p-6` | `p-8` |
| Message padding | `py-4` | `py-6` |
| Avatar-content gap | `gap-4` | `gap-5` |
| Sidebar header | `p-4` | `p-6` |
| Conversation items | `px-3 py-3` | `px-4 py-4` |

---

## 5. Animation & Micro-interactions

### Animation Tokens

```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

--scale-hover: 1.02;
--scale-active: 0.98;
```

### Page Transitions

**Homepage Load:**
1. Logo fades in (0ms delay, 400ms)
2. Title slides up + fades (100ms delay, 400ms)
3. Subtitle fades in (200ms delay, 300ms)
4. Mode cards slide up (300ms delay, staggered 100ms each)
5. Footer fades in (500ms delay, 200ms)

### Hover States

| Element | Effect | Duration |
|---------|--------|----------|
| Primary Button | Scale 1.02, shadow increase | 150ms |
| Ghost Button | Background fade in | 150ms |
| Card | Lift + shadow | 200ms |
| Conversation Item | Background + slight scale | 150ms |

### Loading States

**Skeleton:** Refined shimmer with 1.5s ease-in-out

**Streaming Cursor:** 2px width, gold color, 1s blink

---

## 6. File-by-File Change List

### Core Files

| File | Changes |
|------|---------|
| `app/globals.css` | All CSS variables, animations, typography, utilities |
| `app/layout.tsx` | New Google Fonts imports (Cormorant Garamond, Source Serif 4, JetBrains Mono) |
| `app/page.tsx` | Logo, typography, spacing, mode cards, animations |

### UI Components

| File | Changes |
|------|---------|
| `components/ui/button.tsx` | Border-radius, shadows, hover/active states, variants |
| `components/ui/card.tsx` | Border-radius, shadow, padding, elevated variant |
| `components/ui/input.tsx` | Border-radius, inner shadow, focus states, height |
| `components/ui/textarea.tsx` | Match input updates |
| `components/ui/scroll-area.tsx` | Scrollbar styling |
| `components/ui/dialog.tsx` | Border-radius, backdrop blur, animations |
| `components/ui/sheet.tsx` | Border-radius, backdrop blur, animations |
| `components/ui/dropdown-menu.tsx` | Border-radius, shadow, hover states |
| `components/ui/skeleton.tsx` | Shimmer animation, colors |

### Chat Components

| File | Changes |
|------|---------|
| `components/chat/chat-input.tsx` | Container shape, send button, placeholder, focus states |
| `components/chat/message-item.tsx` | Avatars, spacing, accent, action buttons, cursor |
| `components/chat/message-list.tsx` | Empty state styling |
| `components/chat/citation-card.tsx` | Hover lift, icons, expand animation |
| `components/chat/mode-selector.tsx` | Trigger, accents, dropdown |
| `components/chat/copy-button.tsx` | Hover appearance |
| `components/chat/regenerate-button.tsx` | Hover appearance |
| `components/chat/markdown-content.tsx` | Typography, blockquotes, code blocks |

### Sidebar Components

| File | Changes |
|------|---------|
| `components/sidebar/sidebar.tsx` | Header, New Chat button, footer, spacing |
| `components/sidebar/conversation-item.tsx` | Border-radius, active accent, hover states |
| `components/sidebar/conversation-list.tsx` | Date grouping (optional), empty state |

### Layout Components

| File | Changes |
|------|---------|
| `components/layout/app-layout.tsx` | Sidebar border, mobile header |
| `components/layout/mobile-nav.tsx` | Sheet trigger, animation |

---

## 7. Implementation Phases

### Phase 1: Foundation
- `globals.css` (CSS variables, animations, utilities)
- `layout.tsx` (font imports)

### Phase 2: Core UI Components
- Button, Card, Input, Textarea, Dialog, Sheet

### Phase 3: Chat Experience
- Chat input, Message item, Message list, Citation card

### Phase 4: Navigation
- Sidebar, Conversation item, Mobile nav

### Phase 5: Homepage
- Logo, Typography, Mode cards, Animations

### Phase 6: Polish & Testing
- Cross-browser, Dark mode, Mobile, Accessibility

---

## 8. Quality Checklist

Before considering complete:

- [ ] No purple anywhere in light or dark mode
- [ ] Gold accent used sparingly and consistently
- [ ] All buttons have proper hover/active/focus states
- [ ] Typography hierarchy is clear and consistent
- [ ] Spacing feels generous and unhurried
- [ ] Animations are subtle and smooth
- [ ] Dark mode maintains premium feel
- [ ] Mobile experience is refined
- [ ] Accessibility standards maintained
- [ ] Performance not impacted

---

## 9. Font Loading (next/font/google)

```typescript
import {
  Cormorant_Garamond,
  Cormorant,
  Source_Serif_4,
  Inter,
  JetBrains_Mono
} from 'next/font/google';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
});

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});
```

---

This comprehensive plan provides an actionable roadmap for transforming Quaestio into a premium, refined experience that matches the caliber of Hallow while maintaining its distinctive Catholic identity. The implementation is organized into logical phases, with clear file-by-file changes and quality checkpoints.
