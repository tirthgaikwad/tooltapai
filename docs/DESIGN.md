# Theme Name: Luxury Dark Editorial — ToolTap

## Vibe
- Italian luxury editorial meets Dieter Rams functionalism on a dark canvas: rigorous typographic hierarchy, generous negative space, and restrained warm-metallic accent on a near-black ground. No gradients, no glow, no neon — pure material precision.

## Color
- Background: #121212
- Foreground: #F5F5F5
- Card (Surface): #242424
- Muted: #1B1B1B
- Muted Foreground: #B8B8B8
- Border: rgba(255,255,255,0.06)
- Primary (Accent Burnt Orange): #FF7A18
- On Primary: #0F0F0F
- Accent (Warm Gold): #D4AF37
- On Accent: #0F0F0F
- Secondary: #2A2A2A

CSS variables (dark-only, no light mode):
```
--background: 0 0% 7.1%;         /* #121212 */
--foreground: 0 0% 96.1%;        /* #F5F5F5 */
--card: 0 0% 14.1%;              /* #242424 */
--card-foreground: 0 0% 96.1%;
--muted: 0 0% 10.6%;             /* #1B1B1B */
--muted-foreground: 0 0% 72.2%;  /* #B8B8B8 */
--border: 0 0% 100% / 0.06;      /* rgba(255,255,255,0.06) */
--primary: 27 100% 55%;          /* #FF7A18 */
--primary-foreground: 0 0% 6%;
--accent: 46 65% 52%;            /* #D4AF37 */
--accent-foreground: 0 0% 6%;
--secondary: 0 0% 16.5%;         /* #2A2A2A */
--secondary-foreground: 0 0% 96.1%;
--success: 142 76% 36%;          /* #22C55E */
--warning: 38 92% 50%;           /* #F59E0B */
--ring: 27 100% 55% / 0.4;
--radius: 20px;
--shadow-card: 0 8px 40px rgba(0,0,0,0.45);
--shadow-hover: 0 16px 56px rgba(0,0,0,0.6);
```

## Typography
- Heading: Space Grotesk (family: 'Space Grotesk', sans-serif, weight: 700, url: https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap)
- Body: Inter (family: 'Inter', sans-serif, weight: 400, url: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap)

## Visual Language
- Core visual signature: typographic mass contrast — colossal Space Grotesk headings (tracking -0.03em) juxtaposed with featherweight Inter body copy; warm-orange rule-lines and gold numerical callouts as the only color punctuation
- Material & depth: cards float on #121212 via `box-shadow: 0 8px 40px rgba(0,0,0,0.45)`; hover lifts shadow to `0 16px 56px rgba(0,0,0,0.6)` + translateY(-4px); no blurs, no frosted glass
- Containers & buttons: card radius 20px, surface fill #242424, border rgba(255,255,255,0.06); primary CTA burnt-orange fill + near-black text; ghost buttons use transparent fill + #FF7A18 border; badges use muted fill with colored text
- Layout rhythm: 80px vertical section padding; 24px card gaps; accent color appears only on interactive focal points (max 1 orange element per visual region); gold used sparingly on labels/numbers only

## Animation
- Entrance: cards fade-in + translateY(20px→0) at 300ms ease-out, staggered 40ms per item
- Interaction: card hover translateY(-4px) + shadow deepens at 200ms ease-out; button press scale(0.97) at 100ms
- Scroll / transition: page route changes fade opacity 0→1 at 250ms; search results animate in with stagger

## Forbidden
- No light mode, no theme toggle
- No neon glow, gradients, frosted glass, cyberpunk aesthetics, circuit patterns
- No blue, cyan, purple as primary colors

## Additional Notes
- Fonts must be loaded via Google Fonts @import in index.css
- border-radius throughout: 20px cards, 24px large panels, 12px badges/chips, 50px pill buttons
- Scrollbar: thin, border-colored track on dark background
- Student Mode badge: emerald #22C55E



