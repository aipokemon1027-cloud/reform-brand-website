# AGENTS.md — reform. Brand Website

## Brand Essence

**reform.** = "be the reform"
**Aesthetic:** Soft rebellion. Quiet confidence. Minimal, light-filled, editorial.
**Core palette:** Cream white (#FDFBF7), light pink (#F5E6E8), lavender (#E8E0F0), mint (#E8F0EC)

## Design Reference

Start with `DESIGN.md` in this folder. It defines:
- Colors (brand pastels, surface, hairline)
- Typography (Inter weight 300 headlines, 400 body)
- Spacing (8px base, 96px section rhythm)
- Components (pill buttons, color-block sections, cards)
- Shapes (pill radius, 12px card radius)

Read DESIGN.md before writing any UI.

## Stack

- Pure HTML/CSS (no frameworks)
- Google Fonts: Inter (weight 300, 400, 500)
- Single-page layout: hero → marquee → products → color blocks → features → footer
- Mobile-first responsive (768px breakpoint)

## Key Patterns

**Color-block sections:** Full-width pastel panels (pink, lavender, mint) punctuate the cream canvas as narrative pauses. Each block has 64px vertical padding, 48px horizontal, 20px border-radius.

**Typography:** 
- Headlines: 72px/48px, weight 300, negative letter-spacing (-2px/-1px)
- Body: 16-18px, weight 300, line-height 1.60-1.65
- Captions/labels: 12px, uppercase, letter-spacing 0.5px

**Buttons:** Always pill-shaped (border-radius: 50px). Primary = black fill, secondary = outlined, ghost = text only.

**Cards:** 12px border-radius, 1px lavender border, 24px padding. No shadows.

## Build Commands

No build step required. Open `index.html` directly in browser.

## Important Rules

- Never use shadows or gradients — color and typography do all the work
- Never use square button edges — pill only
- Never use stark white — always cream (#FDFBF7)
- Keep typography light (weight 300) — restraint reads as confidence
- Let whitespace breathe — 96px section gaps minimum