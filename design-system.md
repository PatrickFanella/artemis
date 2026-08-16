# Artemis Hub Design System

## Design Philosophy

**Modern Space Agency.** The UI should feel like today's institutional mission-control interfaces — dark, structured, data-forward. Clean surfaces with subtle borders replace heavy glass panels. Typography and whitespace create hierarchy rather than decorative glow. The atmosphere is grounded and professional: noise grain, vignette, and minimal accent color.

## Color Tokens

### Foundation

```
space-black:    #0A0E17    Background
space-dark:     #131A2A    Surface panels
space-gray:     #1E2940    Borders, dividers
space-slate:    #293548    Elevated surfaces
lunar-white:    #E6EAF0    Primary text
```

### Accents

```
artemis-blue:   #2962FF    Primary accent — links, active
artemis-gold:   #C2892A    Primary accent — MET, highlights
artemis-cyan:   #00B8D4    Tertiary accent — telemetry, data
artemis-red:    #E53935    Alerts, errors
```

### Status

```
status-active:     #22c55e    Live / in-progress (green)
status-upcoming:   #3b82f6    Future items (blue)
status-completed:  #6b7280    Past items (gray)
```

### Category

```
cat-propulsion:     #E53935
cat-navigation:     #2962FF
cat-crew:           #22c55e
cat-communication:  #a855f7
cat-system:         #C2892A
cat-science:        #00B8D4
```

## Typography

- **Headlines**: Space Grotesk, bold, tracking-tight
- **Body**: Inter, 15px, line-height 1.6
- **Monospace (MET/telemetry)**: JetBrains Mono, tabular-nums

### Hierarchy

- Page titles: Space Grotesk, text-3xl, font-bold, tracking-tight
- Section headings: Space Grotesk, text-lg, font-semibold
- Card titles: Space Grotesk or Inter, font-semibold
- Body text: Inter, text-sm/base, secondary/muted tiers
- Labels: `.label` utility — 11px, uppercase, 0.065em tracking

## Semantic Text Tiers

| Utility          | Value  | Use for |
|------------------|--------|---------|
| (default)        | 100%   | Headings, primary body |
| `text-secondary` | 60%    | Sublabels, descriptions |
| `text-muted`     | 40%    | Metadata, captions |
| `text-faint`     | 25%    | Timestamps, hints |

## Panel / Card System

### `.panel` — Standard surface

Solid dark card with subtle border. Use for content cards, stat displays, sections.

```css
background: var(--color-space-dark);
border: 1px solid color-mix(in oklab, var(--color-lunar-white) 7%, transparent);
border-radius: 0.5rem;
```

### `.panel-hover` — Interactive panel

Add to `.panel` for hover effects (border highlight, subtle lift).

### `.glass-card` — Depth overlay

Use only for modals and overlays where depth matters. Blur + higher opacity.

## Semantic Borders

| Utility          | Value | Use for |
|------------------|-------|---------|
| `border-subtle`  | 7%    | Panel borders |
| `border-default` | 12%   | Dividers, interactive edges |

## Atmosphere

- **Noise grain**: SVG feTurbulence at 2.5% opacity (replaced the old starfield)
- **Vignette**: subtle top-to-bottom gradient
- **Background**: solid `space-black`, no ambient orbs

## Spacing

- Section gaps: `space-y-8` to `space-y-12`
- Card padding: `p-4` to `p-6`
- Page padding: `px-6 py-10`
- Grid gaps: `gap-3` to `gap-6`

## Interaction

- Hover: border highlight + subtle shadow (panel-hover)
- Focus: 2px artemis-blue outline + 2px offset (global `:focus-visible`)
- Motion: 200ms ease transitions, `fade-in-up` entrance (0.4s)
- Reduced motion respected globally

## Accessibility

- Text contrast: #E6EAF0 on #0A0E17 = minimum 15:1
- Muted text: minimum 25% opacity (never lower)
- Focus visible on all interactive elements
- Touch targets: minimum 44px
- `prefers-reduced-motion` disables animations