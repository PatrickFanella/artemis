# Artemis Hub Design System

## Design Philosophy

**Core Identity**: Mission Control from the Future. The UI should feel like a next-generation spacecraft operations console — immersive dark environments, glowing telemetry, glass panels floating in deep space. Every element should reinforce the feeling that the user is monitoring a live lunar mission.

**Visual DNA**: Deep space blacks layered with glass panels, atmospheric neon glows (gold, blue, cyan), monospace telemetry readouts, and subtle environmental effects (star field, grid lines, scan lines). Premium and immersive, never flat or generic.

---

## Color Tokens

### Foundation

```
space-black:    #0a0d15    Deep void — primary background
space-dark:     #111827    Elevated surface — cards, panels
space-gray:     #1f2937    Tertiary — borders, dividers
lunar-white:    #f0f0f5    Primary text
```

### Accents

```
artemis-gold:   #f59e0b    Primary accent — MET, highlights, CTAs
artemis-blue:   #3b82f6    Secondary accent — links, active states
artemis-cyan:   #06b6d4    Tertiary accent — telemetry, progress
artemis-red:    #ef4444    Alerts, errors
```

### Status

```
status-active:     #22c55e    Live / in-progress (green)
status-upcoming:   #3b82f6    Future items (blue)
status-completed:  #6b7280    Past items (gray)
```

### Mission Categories

```
cat-propulsion:     #ef4444
cat-navigation:     #3b82f6
cat-crew:           #22c55e
cat-communication:  #a855f7
cat-system:         #f59e0b
cat-science:        #06b6d4
```

---

## Typography

### Font Stack

- **Headlines**: `"Space Grotesk", system-ui, sans-serif` — geometric, futuristic, distinctive
- **Body**: `"Inter", system-ui, sans-serif` — clean, highly readable
- **Monospace (MET/telemetry)**: `"JetBrains Mono", "Fira Code", monospace` — tabular nums, technical

### Import

```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap");
```

### Hierarchy

- Page titles: Space Grotesk, text-3xl+, font-bold, tracking-tight
- Section headings: Space Grotesk, text-lg, font-semibold
- Body text: Inter, text-sm/base
- Labels/metadata: Inter or JetBrains Mono, text-xs, uppercase tracking-wider
- MET display: JetBrains Mono, text-4xl+, tabular-nums

---

## Card System (Glass Panels)

All cards use the glass panel treatment:

```css
background: rgba(17, 24, 39, 0.6); /* space-dark at 60% */
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 12px; /* rounded-xl */
transition: all 300ms ease-out;
```

### Hover (interactive cards)

```css
border-color: rgba(59, 130, 246, 0.3); /* artemis-blue glow */
background: rgba(17, 24, 39, 0.8);
box-shadow: 0 0 20px rgba(59, 130, 246, 0.08);
transform: translateY(-1px);
```

### Highlighted / Active Cards

```css
border-color: rgba(34, 197, 94, 0.3); /* status-active */
box-shadow:
  0 0 20px rgba(34, 197, 94, 0.06),
  0 0 0 1px rgba(34, 197, 94, 0.1);
```

---

## Glow Effects

Multi-layered box-shadows for atmospheric depth:

```css
.glow-green {
  box-shadow:
    0 0 8px rgba(34, 197, 94, 0.4),
    0 0 24px rgba(34, 197, 94, 0.15),
    0 0 48px rgba(34, 197, 94, 0.05);
}
.glow-blue {
  box-shadow:
    0 0 8px rgba(59, 130, 246, 0.4),
    0 0 24px rgba(59, 130, 246, 0.15),
    0 0 48px rgba(59, 130, 246, 0.05);
}
.glow-gold {
  box-shadow:
    0 0 8px rgba(245, 158, 11, 0.4),
    0 0 24px rgba(245, 158, 11, 0.15),
    0 0 48px rgba(245, 158, 11, 0.05);
}
```

---

## Atmospheric Effects

### Star Field

CSS radial-gradient dots at random sizes and positions, fixed to viewport, very low opacity.

### Grid Overlay

Subtle grid lines in accent color at ~2% opacity for mission-control feel:

```css
background-image:
  linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
background-size: 60px 60px;
```

### Noise Texture

SVG feTurbulence at ~2% opacity for subtle grain.

### Ambient Orbs

Large blurred radial gradients in gold/blue positioned behind hero areas.

---

## Animation

### Motion Philosophy

Smooth and purposeful. Ease-out for entering, ease-in for exiting. Nothing bouncy.

### Transitions

- Cards: 300ms ease-out (border, background, shadow, transform)
- Buttons/links: 200ms ease-out
- Live indicators: CSS animate-ping (built-in)
- MET display: 1s interval tick

### Hover Effects

- Cards: border glow + subtle lift (translateY -1px)
- Links: color shift to accent
- Buttons: brightness + shadow glow

### Reduced Motion

Respect `prefers-reduced-motion` — disable animations, keep static states.

---

## Spacing

- Section gaps: `space-y-6` to `space-y-8`
- Card padding: `p-4 md:p-6`
- Page padding: `px-4 py-8` (within max-w-7xl container)
- Grid gaps: `gap-4` to `gap-6`

---

## Accessibility

- Primary text contrast: #f0f0f5 on #0a0d15 = 17:1 (exceeds AAA)
- Muted text: use /50–/60 opacity minimum for readability
- Focus: ring-2 ring-artemis-blue with offset
- Touch targets: minimum 44px
- All animations respect prefers-reduced-motion
