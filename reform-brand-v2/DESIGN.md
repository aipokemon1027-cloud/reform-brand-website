---
version: alpha
name: reform-design-system
description: "Soft rebellion. A minimal, light-filled brand canvas built on cream white (#FDFBF7) with soft pastel color blocks — light pink, lavender, and cream — that feel quiet yet intentional. The design language is editorial and calm, with generous whitespace and fine-weight typography. Every element earns its place."

colors:
  primary: "#1a1a1a"
  on-primary: "#ffffff"
  ink: "#1a1a1a"
  canvas: "#FDFBF7"
  inverse-canvas: "#1a1a1a"
  inverse-ink: "#ffffff"
  on-inverse-soft: "rgba(255,255,255,0.16)"
  hairline: "#E8E0F0"
  hairline-soft: "#F0EBF5"
  surface-soft: "#F5E6E8"
  block-pink: "#F5E6E8"
  block-lavender: "#E8E0F0"
  block-cream: "#FDFBF7"
  block-mint: "#E8F0EC"
  accent-dusty-rose: "#D4A5A5"
  semantic-success: "#6B9E7A"
  overlay-scrim: "rgba(26,26,26,0.6)"

typography:
  display-xl:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 72px
    fontWeight: 300
    lineHeight: 1.00
    letterSpacing: -2px
  display-lg:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 48px
    fontWeight: 300
    lineHeight: 1.10
    letterSpacing: -1px
  headline:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.30
    letterSpacing: -0.3px
  subhead:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 20px
    fontWeight: 300
    lineHeight: 1.50
    letterSpacing: 0
  body-lg:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.60
    letterSpacing: 0
  body:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 300
    lineHeight: 1.65
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.50
    letterSpacing: 0.2px
  link:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0
  button:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.00
    letterSpacing: 0.5px
  caption:
    fontFamily: "Inter, -apple-system, system-ui, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.40
    letterSpacing: 0.5px
    textTransform: uppercase

rounded:
  xs: 2px
  sm: 6px
  md: 12px
  lg: 20px
  xl: 28px
  pill: 50px
  full: 9999px

spacing:
  hair: 1px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  xxxl: 64px
  section: 96px

components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
  button-primary-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-primary}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
    border: "1px solid {colors.hairline}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 10px 16px
  button-icon-circular:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.full}"
    size: 40px
  color-block-section:
    backgroundColor: "{colors.block-pink}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 64px 48px
  color-block-section-lavender:
    backgroundColor: "{colors.block-lavender}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 64px 48px
  color-block-section-cream:
    backgroundColor: "{colors.block-cream}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 64px 48px
  color-block-section-mint:
    backgroundColor: "{colors.block-mint}"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.lg}"
    padding: 64px 48px
  card-product:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 24px
    border: "1px solid {colors.hairline}"
  top-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    height: 64px
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    padding: 64px 48px
    borderTop: "1px solid {colors.hairline-soft}"
  feature-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  divider:
    backgroundColor: "{colors.hairline-soft}"
    height: 1px
    width: "100%"
---

## Overview

reform. is a lifestyle brand with an aesthetic of **soft rebellion** — the belief that quiet confidence is its own kind of power. The design language is minimal, light-filled, and editorial. Cream white (#FDFBF7) anchors every surface. Pastel color blocks (light pink, lavender, cream) punctuate long-scroll pages as narrative pauses, not decoration.

The brand voice is understated. Headlines use fine-weight typography at generous scale. Body copy breathes in 1.60–1.65 line-height. Every element earns its place. There's no clutter, no noise, no trying too hard.

**Key Characteristics:**
- Cream white canvas (`#FDFBF7`) — never stark white, always warm
- Pastel color-block sections (light pink `#F5E6E8`, lavender `#E8E0F0`, mint `#E8F0EC`) as narrative pauses
- Fine-weight typography — weight 300 throughout headlines, weight 400 for body and UI
- Pill-shaped buttons exclusively — no square edges
- Generous whitespace — sections breathe with 96px vertical rhythm
- No shadows, no gradients — color and typography do all the work

## Colors

### Brand & Primary
- **Ink** (`{colors.ink}`): Near-black (`#1a1a1a`) for all primary text, headlines, and the primary button background.
- **On Primary** (`{colors.on-primary}`): White (`#ffffff`) for text on dark/inverted surfaces.
- **Canvas** (`{colors.canvas}`): Warm cream white (`#FDFBF7`) — the default page background.

### Pastel Blocks (Brand Signature)
- **Block Pink** (`{colors.block-pink}`): Soft blush pink (`#F5E6E8`) — brand signature, used for hero sections and product highlights.
- **Block Lavender** (`{colors.block-lavender}`): Light lavender (`#E8E0F0`) — for secondary accent sections.
- **Block Cream** (`{colors.block-cream}`): Cream (`#FDFBF7`) — used for subtle elevated surfaces, same as canvas but can be layered.
- **Block Mint** (`{colors.block-mint}`): Soft mint (`#E8F0EC`) — for variety in color-block sequences.

### Surface & Structure
- **Surface Soft** (`{colors.surface-soft}`): Dusty pink (`#F5E6E8`) for cards and circular buttons on light backgrounds.
- **Hairline** (`{colors.hairline}`): Lavender tint (`#E8E0F0`) for borders and dividers.
- **Hairline Soft** (`{colors.hairline-soft}`): Very light lavender (`#F0EBF5`) for subtle separators.

### Semantic
- **Accent Dusty Rose** (`{colors.accent-dusty-rose}`): Muted rose (`#D4A5A5`) for hover states and subtle emphasis.
- **Success** (`{colors.semantic-success}`): Soft green (`#6B9E7A`) for confirmation states.

## Typography

### Font Family
**Inter** as primary — weight 300 for headlines, weight 400 for body and UI. Fallback: `-apple-system, system-ui, sans-serif`.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `display-xl` | 72px | 300 | 1.00 | -2px | Hero headlines |
| `display-lg` | 48px | 300 | 1.10 | -1px | Section openers |
| `headline` | 28px | 400 | 1.30 | -0.3px | Story titles inside color blocks |
| `subhead` | 20px | 300 | 1.50 | 0 | Body-length paragraphs at near-headline scale |
| `body-lg` | 18px | 300 | 1.60 | 0 | Hero subtitle, lead copy |
| `body` | 16px | 300 | 1.65 | 0 | Default body text |
| `body-sm` | 14px | 400 | 1.50 | 0.2px | Card text, secondary UI |
| `caption` | 12px | 400 | 1.40 | 0.5px | Labels, eyebrows (uppercase) |

## Layout

### Spacing System
- **Base unit**: 8px.
- **Section rhythm**: 96px between major content sections.
- **Color-block interior**: 64px vertical, 48px horizontal padding.
- **Card padding**: 24px.
- **Button padding**: 14px 28px (primary), 12px 24px (secondary).

### Grid & Container
- Max width: 1200px with 48px side gutters on desktop.
- Two and three-column grids for product/card layouts.
- Color-block sections span full content width with centered editorial column.

### Whitespace Philosophy
Generous. Sections breathe with 96px vertical gaps. Inside color blocks, type gets generous side margins so each block reads as a statement, not copy. White space is the brand's quiet confidence made visible.

## Elevation & Depth

Flat design. No shadows, no gradients. Color blocks substitute for traditional elevation — the shift from cream canvas to pastel block is the section break. Borders (hairline) handle card definition. This restraint is the brand.

## Shapes

### Border Radius
- `pill` (50px): All text CTAs and buttons
- `lg` (20px): Color-block sections
- `md` (12px): Cards, product tiles
- `full` (9999px): Circular icon buttons

## Components

### Buttons

**`button-primary`** — Black pill button. The brand's primary action.
- Background `{colors.ink}`, text white, padding 14px 28px, rounded pill.

**`button-secondary`** — Outlined pill, transparent fill, lavender border.
- Used for secondary actions.

**`button-ghost`** — Text-only pill for tertiary actions.

**`button-icon-circular`** — 40px circular button with dusty rose background.

### Color-Block Sections

Full-width panels with 20px rounded corners and 64px/48px interior padding. Variants:
- `color-block-section`: Pink background — for hero and primary sections
- `color-block-section-lavender`: Lavender background — for secondary accent
- `color-block-section-cream`: Cream background — for subtle pauses
- `color-block-section-mint`: Mint background — for variety

### Cards

**`card-product`** — Product display card on cream canvas.
- Background `{colors.canvas}`, border 1px `{colors.hairline}`, rounded 12px, padding 24px.

### Navigation

**`top-nav`** — Sticky cream bar, 64px height. Logo left, links right. No visible border — just clean separation from content.

### Footer

**`footer`** — Simple cream footer with top border. Caption typography, generous padding.

## Do's and Don'ts

### Do
- Use cream white (`#FDFBF7`) as the default canvas — never stark white
- Apply pastel color blocks generously for narrative rhythm
- Use pill buttons exclusively — no square edges
- Keep typography light (weight 300 headlines) — restraint reads as confidence
- Let whitespace breathe — 96px section gaps, generous side margins

### Don't
- Don't use shadows or gradients — color and type do all the work
- Don't make anything loud or aggressive — soft rebellion is quiet
- Don't clutter pages — every element earns its place
- Don't use heavy typography — weight 300 for headlines, not bold
- Don't mix in competing accent colors — the palette is cream, pink, lavender, mint