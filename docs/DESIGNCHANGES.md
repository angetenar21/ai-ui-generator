# 🎨 AI Workshop Studio – Light Theme Design Spec (Final)

AI Workshop Studio is a **light-mode, research-driven UI generator**.
The main experience is a **single conversation feed** where the user
types prompts and receives rich **analysis cards, research summaries,
and generated UI previews**.

---

## 1. Current State → Target State

### Current

- Generic blue buttons (`#3b82f6`)
- Flat white/gray backgrounds
- Standard sidebar layout
- Plain chat bubbles
- Weak visual hierarchy
- Components that feel like a 2020 admin dashboard

### Target

- **Warm, analytical light theme**
- **Single-column, focused feed**, no busy split-screen layouts
- Conversation **between user and AI** where responses are **rich cards**
- Clear hierarchy between:
  - Prompt
  - Analysis
  - Visualisation (charts/tables)
  - UI preview / actions

---

## 2. Design Vision – “Warm Analytical”

**Theme:** A **clean, analytical studio** where AI behaves like a
research partner and UI co-designer.

The UI should feel:

- **Clean & Analytical** – Light backgrounds, clear cards, minimal noise.
- **Focused** – Single primary column; no side-by-side “before vs after”.
- **Professional & Trustworthy** – Neutral typography, soft warm accents.
- **Subtle & Responsive** – Micro-interactions for feedback, not flash.

---

## 3. Design System

### 3.1 Color Palette – “Warm Analytical”

```txt
Background Layers
- Page Background:  #F3F4F6   (light gray)
- Card Surface:     #FFFFFF   (white)
- Sub-Surface:      #F9FAFB   (very light gray, inside cards)

Accents
- Primary Gradient: #F59E0B → #EA580C   (warm amber → deep orange)
- Primary Solid:    #F97316             (orange-600)
- Success:          #10B981             (green-500)
- Warning:          #F59E0B             (amber-500)
- Error:            #EF4444             (red-500)

Text
- Primary:   #111827  (gray-900)
- Secondary: #374151  (gray-700)
- Muted:     #6B7280  (gray-500)
- Disabled:  #9CA3AF  (gray-400)

Borders & Dividers
- Card Border:      #E5E7EB  (gray-200)
- Subtle Divider:   rgba(209, 213, 219, 0.9)
````

> **Rule:** No blue UI elements. Any previous blues become
> warm oranges, neutrals, or semantic colours (green/red/amber).

---

### 3.2 Typography

```txt
Headings
- Font:    "Space Grotesk"
- Weights: 700 (bold), 600 (semibold)

Body
- Font:    "Inter"
- Weights: 400 (regular), 500 (medium)

Code / Mono
- Font: "JetBrains Mono"
```

Usage:

* Page titles: Space Grotesk 24–28 / 700
* Section titles: 18–20 / 600
* Body: Inter 14–16 / 400–500
* Captions & meta: Inter 12–13 / 400
* Metrics: Space Grotesk or JetBrains Mono (to emphasise numbers)

---

### 3.3 Spacing, Radius & Shadows

* Base unit: **4px**
* Content max width: **1280px (`max-w-5xl`)**
* Page padding: 24px desktop, 16px tablet/mobile
* Card radius: **18px**
* Pill / chips / prompt bar: **999px**
* Shadows:

  * Cards: `0 16px 40px rgba(0, 0, 0, 0.05)`
  * Prompt bar: `0 18px 45px rgba(0, 0, 0, 0.12)`

Depth is created through **borders + soft shadows**, not glassmorphism.

---

## 4. Layout

### 4.1 Page Shell

```txt
┌─────────────────────────────────────────────┐
│  Top Bar (sticky)                           │
├─────────────────────────────────────────────┤
│                                             │
│  Single-column conversation feed            │
│  (stack of generated cards & messages)      │
│                                             │
│  [floating prompt bar - fixed to bottom]    │
└─────────────────────────────────────────────┘
```

* **No persistent sidebar.**
* All content sits inside a centered `max-w-5xl` container.
* The **prompt bar** is fixed to the bottom of the viewport and aligned
  with the same width as the feed.

---

## 5. Core Components

### 5.1 Top Bar – “Main Navigation”

**Purpose:** Brand + minimal controls. It should disappear into the
background, not fight with the feed.

**Visual:**

* Sticky at top, full width.
* Background: `bg-white/70` with `backdrop-blur-lg`.
* Bottom border: `border-b border-gray-200`.

```txt
┌─────────────────────────────────────────────┐
│ [✨ AI Workshop Studio]      [History] [👤] │
└─────────────────────────────────────────────┘
```

* Logo text uses primary gradient as a small mark/icon, not huge.
* Optional right-side items:

  * “History” opens a modal or side sheet.
  * Profile / settings icon.

---

### 5.2 Prompt Bar – “Ask & Generate”

**This is the main interaction element.**

```txt
┌─────────────────────────────────────────────┐
│  [📎]  Describe what you want to analyse…   │
│                          [ Generate UI ↑ ]  │
└─────────────────────────────────────────────┘
```

* Position: `fixed bottom-0 left-0 right-0`
* Centered using `max-w-5xl mx-auto px-4 pb-4`.
* Background: `bg-white/80` + `backdrop-blur-xl`.
* Radius: `rounded-full`.
* Border: `border border-gray-200`.
* Focus state (`:focus-within`):

  * Border color transitions to orange.
  * Shadow strengthens.

Inside:

* Left: attachment icon (for CSVs, screenshots, etc).
* Middle: expanding textarea (1–4 lines).
* Right: primary button with **orange gradient**.

---

### 5.3 Conversation Feed – “Analysis Canvas”

The feed is **chat-like**, but AI responses are richer **analysis cards**.

Top-down flow:

1. **User Prompt Bubble (compact)**
2. **AI Response Card:** analysis + research + optional UI preview.

Each cycle adds a new pair to the **top of the feed** (or bottom, depending
on implementation; choose one and keep consistent).

#### 5.3.1 User Prompt Bubble

* Smaller visual weight than AI cards.
* Background: `#F3F4F6` (`bg-gray-100`).
* Radius: `rounded-2xl`.
* Placed slightly to the right to hint “user”.

```txt
[ You ]  "Compare ad spend vs sales by region and show a dashboard layout."
```

#### 5.3.2 AI Generated Card

**Structure inside each card:**

```txt
┌─────────────────────────────────────────────┐
│ [🔶 Generated analysis]      [⋯ actions]    │  header
│                                            │
│ <Title: Ad Spend vs Sales>                 │
│ Short summary paragraph (1–2 lines)        │
│                                            │
│ [Metric row: 2–3 metric chips]             │
│                                            │
│ [Chart / preview area]                     │
│                                            │
│ [Research & UX suggestions pills / notes]  │
│                                            │
│ [Buttons: Regenerate · Save layout · Copy] │
└─────────────────────────────────────────────┘
```

**Visual Details:**

* Card background: `#FFFFFF`.
* Border: `1px solid #E5E7EB`.
* Shadow: light (`shadow-lg shadow-black/5`).
* Header chip:

  * Background: `bg-gradient-to-r from-[#F59E0B] to-[#EA580C]`.
  * Text: white, label like `Generated analysis`, `UI layout`, or `Research`.

**Metric row:**

* Each metric is a small sub-card:

  * Background: `#F9FAFB`.
  * Border radius: `12px`.
  * Title (label) + large numeric value (Space Grotesk).
  * Delta indicator (green/red) if applicable.

**Chart / table:**

* Contained within a `bg-gray-50` sub-surface with its own padding.
* Chart uses neutral grays + semantic green/red/orange (no blue).

**Research / UX section:**

* Inline pills or small note cards such as:

  * “Best practices”
  * “Common pitfalls”
  * “Suggested layout”
* Keep these small, aligned to the right or below the chart to feel
  like **assistant hints**, not a second panel.

**Actions:**

* Right-aligned row: “Regenerate”, “Save layout”, “Copy spec”.
* Primary or destructive actions use warm accent + semantic colours.

---

### 5.4 Gallery – “Inspiration Vault”

Same feed layout, but cards show **templates** instead of analysis.

Card content:

* Preview image / skeleton UI.
* Template title + 1–2 line description.
* Tag chips (e.g. “Dashboard”, “Form”, “Landing page”).
* “Use template” button with orange gradient.

---

### 5.5 Inspector – “Code Lab”

Inspector appears as a **special AI card** or a dedicated route reusing
the same shell.

Inside the card:

```txt
┌─────────────────────────────────────────────┐
│ [🔶 Component inspector]                    │
│                                            │
│ [ Live Preview ]                            │
│ ------------------------------------------ │
│ [ JSON / Spec Editor ]                     │
│                                            │
│ [ Save · Copy JSON · Export ]              │
└─────────────────────────────────────────────┘
```

* Live preview on top, JSON/editor below on light `bg-gray-50`.
* Editor uses `JetBrains Mono`, 13px, with a soft border.

---

## 6. Micro-interactions & Motion

### Global

* Route / major view change: quick fade (`150–200ms`) + slight `translateY`.
* Cards entering feed:

  * `opacity: 0 → 1`
  * `translateY: 8px → 0`
  * `duration: 220–260ms`

### Buttons

* Hover:

  * Scale: `1.03`.
  * Shadow: slightly stronger.
* Active:

  * Scale: `0.97` then return to `1.0`.

### Inputs

* Focus:

  * Border color animates from gray → orange.
  * Prompt bar shadow becomes more noticeable.

### Loading

* Skeletons for:

  * Metric rows
  * Chart block
  * Table rows
* Skeleton colour: gradient between `#E5E7EB` and `#F3F4F6` with slow shimmer.

### Typing Indicator

* Small row just above the prompt bar while generating:

  * Three dots in orange gradient, pulsing gently.

---

## 7. Implementation Notes

### 7.1 Tailwind Tokens (Example)

```ts
// tailwind.config.js (excerpt)
theme: {
  extend: {
    colors: {
      bg: {
        page: '#F3F4F6',
        card: '#FFFFFF',
        sub: '#F9FAFB',
      },
      accent: {
        from: '#F59E0B',
        to: '#EA580C',
        solid: '#F97316',
      },
      state: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      text: {
        primary: '#111827',
        secondary: '#374151',
        muted: '#6B7280',
        disabled: '#9CA3AF',
      },
      border: {
        subtle: '#E5E7EB',
      },
    },
    borderRadius: {
      card: '18px',
      pill: '999px',
    },
    maxWidth: {
      'page': '72rem', // 1152px or use '5xl' as you prefer
    },
  },
}
```

Use utility classes:

* Page: `bg-bg-page`
* Card: `bg-bg-card rounded-card border border-border-subtle`
* Sub-surface: `bg-bg-sub rounded-xl`
* Primary button: `bg-gradient-to-r from-accent-from to-accent-to text-white`

---

## 8. Implementation Checklist

### Phase 1 – Foundation

* [ ] Add fonts (Space Grotesk, Inter, JetBrains Mono).
* [ ] Update Tailwind/theme config with the **Warm Analytical palette**.
* [ ] Replace legacy blue colours with the new tokens.
* [ ] Implement `PageShell`:

  * Sticky `TopBar`
  * Centered `max-w-page` container
  * `bg-bg-page` body.

### Phase 2 – Core Experience

* [ ] Build `PromptBar` (fixed, pill, glassy light background).
* [ ] Build `ConversationFeed` that renders:

  * User prompt bubble
  * AI generated card(s)
* [ ] Implement `GeneratedCard` with slots/sections:

  * Header chip
  * Title + summary
  * Metrics row
  * Visualization block
  * Research / UX hints
  * Action row
* [ ] Add loading skeletons and typing indicator.

### Phase 3 – Extended Views

* [ ] Gallery cards (template previews) using same card pattern.
* [ ] Inspector card (preview + JSON editor).
* [ ] History access (via TopBar button → modal / side sheet).

### Phase 4 – Polish

* [ ] Install `framer-motion` and wire card/route animations.
* [ ] Add hover/active states for all interactive elements.
* [ ] Refine responsive behavior:

  * Full-width feed on mobile with appropriate padding.
  * Prompt bar adjusts to screen width while staying pill-shaped.
* [ ] QA: check contrast, focus states, and keyboard navigation.

---

**End of Design Document**

