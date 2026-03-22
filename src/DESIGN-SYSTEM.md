# paytonwallace.com Design System

Canonical reference for typography, color, and layout conventions.
Every page and component follows this system. Deviating requires updating this doc.

---

## Font Stack

| Role | Font | CSS Variable | Imported In |
|------|------|-------------|-------------|
| **Sans** (default) | Geist | `--font-geist-sans` | `src/app/layout.tsx` via `next/font/google` |
| **Mono** (terminal, labels, code) | Geist Mono | `--font-geist-mono` | `src/app/layout.tsx` via `next/font/google` |

Both are applied to `<body>` as CSS variable classes. Body defaults to sans via `font-family: var(--font-geist-sans, sans-serif)` in `globals.css`.

**When to use mono:** file paths, terminal UI, section labels (e.g. `tools.md`), navigation items, timestamps, badges, code, form inputs in terminal-style forms, footer.

**When to use sans:** headings, body paragraphs, card titles, buttons, form inputs in standard forms (e.g. Comments).

---

## Typographic Scale

10 sizes. No other values should appear in the codebase.

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| **label** | 9px | 400-600 | 1.5 | 0.1em | Uppercase badges, status tags, category pills, tiny mono labels |
| **caption** | 10px | 400 | 1.5 | 0.06em | File paths, timestamps, metadata, progress %, terminal hints |
| **small** | 11px | 400-500 | 1.5 | 0.06em | Section file labels (`about.md`), terminal text, footer, status bar |
| **ui** | 12px | 400-600 | 1.5 | 0.06em | Buttons, sidebar nav, category filters, form inputs (mono), card names, descriptions |
| **body** | 14px | 400 | 1.7 | 0 | Paragraphs, excerpts, descriptions, feature lists, article body, form inputs (sans) |
| **subhead** | 16px | 600 | 1.3 | 0 | Blog post titles (in lists), card titles, h3 in articles, modal definitions |
| **heading** | 22px | 600-700 | 1.3 | -0.02em | Section headings (h2): "tech stack", "library", "mr.wallace console" |
| **title** | 28px | 700 | 1.3 | -0.02em | Page titles (h1): `/mrwallace`, article titles, "life outside the desk" |
| **display** | 32px | 700 | 1.3 | -0.02em | Template detail title (desktop only) |
| **hero** | clamp(40px, 5.5vw, 72px) | 700 | 1.0 | -0.02em | Hero name only — "Payton Wallace" |

### Eliminated Sizes

These sizes existed previously and have been consolidated:

- 8px -> 9px (label)
- 13px -> 12px (ui)
- 15px -> 14px (body)
- 17px -> 16px (subhead)
- 18px -> 16px (subhead)
- 20px -> 22px (heading) — article h2 now matches section h2
- 24px -> 28px (title)
- 26px -> 28px (title, mobile)

---

## Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| **normal** | 400 | Body text, descriptions, captions, labels |
| **medium** | 500 | Buttons, active nav items, emphasis |
| **semibold** | 600 | Headings, card titles, badges, section headers |
| **bold** | 700 | Page titles, hero, avatar initials |

---

## Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| **none** | 1.0 | Hero heading only |
| **tight** | 1.3 | Headings, titles, subheadings |
| **normal** | 1.5 | UI text, short descriptions, code, labels |
| **relaxed** | 1.7 | Body paragraphs, long-form content, article text |

### Eliminated Line Heights

- 1.4, 1.45 -> 1.3 or 1.5
- 1.6, 1.65 -> 1.5
- 1.75, 1.8, 1.85 -> 1.7

---

## Letter Spacing

| Token | Value | Usage |
|-------|-------|-------|
| **tight** | -0.02em | Large headings (h1, h2, hero, display) |
| **normal** | 0 | Body text, descriptions, subheadings |
| **wide** | 0.06em | Mono labels, terminal text, small caps |
| **wider** | 0.1em | Uppercase badges, nav section headers |

### Eliminated Spacings

- -0.03em, -0.01em -> -0.02em (tight)
- 0.02em, 0.04em, 0.05em -> 0.06em (wide)
- 0.08em, 0.14em, 0.15em -> 0.1em (wider)
- -0.3px, -0.5px -> -0.02em (tight)

---

## Text Color Tokens

All defined as CSS custom properties in `src/app/globals.css`.

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--text` | #0a0a0a | #f0f0f0 | Primary text: headings, titles, names, active nav |
| `--text-muted` | #525252 | #a8a8a8 | Secondary text: body, descriptions, excerpts |
| `--text-faint` | #999999 | #6a6a6a | Tertiary: timestamps, file paths, hints, inactive nav |

### Accent Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Green** | #22c55e | Links, active indicators, success states, accent badges, code in articles |
| **Red** | #ef4444 | Error states only |
| **Amber** | #f59e0b | "Coming soon" status only |

---

## Background & Border Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg` | #ffffff | #050505 | Page background |
| `--bg-surface` | #f5f5f5 | #0e0e0e | Cards, panels, sidebar, file blocks |
| `--bg-surface-hover` | #ebebeb | #1a1a1a | Hover state for surfaces |
| `--border` | #e0e0e0 | #222222 | Default borders |
| `--border-hover` | #aaaaaa | #4a4a4a | Hover borders |
| `--yellow` | rgba(253,224,71,0.3) | rgba(253,224,71,0.18) | Text hover highlight |

---

## Component Conventions

### Section Labels

Every major section starts with a mono file-path label:

```
fontFamily: "var(--font-geist-mono)"
fontSize: "11px"           // small
color: "var(--text-faint)"
marginBottom: "32px"
```

Example: `about.md`, `tools.md`, `generosity.md`, `life.md`, `connect.md`

### FileBlock Headers

Terminal-style container headers:

```
path:  fontFamily: mono, fontSize: "11px", color: var(--text-faint)
meta:  fontFamily: mono, fontSize: "10px", color: var(--text-faint)
```

### Buttons (Primary)

```
padding: "10px 24px"
background: "var(--text)"
color: "var(--bg)"
fontSize: "12px"            // ui
fontWeight: 500
borderRadius: "8px"
letterSpacing: "0.06em"     // wide (for mono buttons)
```

### Buttons (Secondary / Outline)

```
padding: "10px 24px"
background: "transparent"
color: "var(--text)"
fontSize: "12px"
fontWeight: 500
borderRadius: "8px"
border: "1px solid var(--border)"
```

### Category Badges

```
fontFamily: "var(--font-geist-mono)"
fontSize: "9px"             // label
textTransform: "uppercase"
letterSpacing: "0.1em"      // wider
padding: "2px 6px"
borderRadius: "4px"
```

### Section Headings (h2)

```
fontSize: "22px"            // heading
fontWeight: 600
color: "var(--text)"
letterSpacing: "-0.02em"    // tight
marginBottom: "6px"
```

### Page Titles (h1)

```
fontSize: "28px"            // title
fontWeight: 700
color: "var(--text)"
letterSpacing: "-0.02em"    // tight
lineHeight: 1.3
```

---

## Layout Constants

| Element | Value |
|---------|-------|
| Sidebar width | 240px |
| Content max-width | 720px (blog/sections), 860px (tools) |
| Section padding (desktop) | 64px 56px |
| Section padding (mobile) | 40px 20px |
| Mobile breakpoint | 768px |
| Border radius (cards) | 8-10px |
| Border radius (buttons) | 6-8px |
| Border radius (badges) | 4px |

---

## Rules for Future Additions

1. **Pick from the scale.** If a size isn't in the table above, don't use it. If you need something between two sizes, use the smaller one.

2. **Mono for metadata, sans for content.** File paths, timestamps, badges, nav labels = mono. Headings, paragraphs, descriptions = sans (default).

3. **Use CSS variables for colors.** Never hardcode `#525252` — use `var(--text-muted)`. The only hardcoded colors are accents: `#22c55e`, `#ef4444`, `#f59e0b`.

4. **Line heights follow content type.** Headings get 1.3. UI/labels get 1.5. Body paragraphs get 1.7. Hero gets 1.0.

5. **Letter spacing follows size.** Large headings (22px+) get -0.02em. Body gets 0. Mono labels get 0.06em. Uppercase badges get 0.1em.

6. **Weights are semantic.** 400 = reading text. 500 = interactive (buttons, links). 600 = emphasis (headings, card titles). 700 = impact (page titles, hero).

7. **Mobile adjustments** use the same scale — just pick a smaller token. Don't introduce fractional or non-scale values for mobile.

---

## Files Modified in This Audit

- `src/app/globals.css` — type scale reference comment, article styles standardized
- `src/app/layout.tsx` — unchanged (font imports are correct)
- `src/components/Hero.tsx`
- `src/components/About.tsx`
- `src/components/Tools.tsx`
- `src/components/Generosity.tsx`
- `src/components/Connect.tsx`
- `src/components/LifeMd.tsx`
- `src/components/Sidebar.tsx` — already standard, no changes needed
- `src/components/BlogNav.tsx` — already standard, no changes needed
- `src/components/Footer.tsx` — already standard, no changes needed
- `src/components/TerminalWindow.tsx` — already standard, no changes needed
- `src/components/GROWTHModal.tsx`
- `src/components/Games.tsx`
- `src/components/LoadingScreen.tsx`
- `src/components/blog/BlogLoadingScreen.tsx`
- `src/components/blog/Comments.tsx`
- `src/components/blog/ShareButton.tsx`
- `src/app/mrwallace/page.tsx`
- `src/app/mrwallace/[slug]/ArticleClient.tsx`
