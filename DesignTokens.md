# CricGames Design System Tokens

## Colors
| Token | Value | Description |
|-------|-------|-------------|
| `bg-background` | `#0b0b0b` | Main application background (Deep Black) |
| `bg-surface` | `#161616` | Card and component background (Dark Gray) |
| `text-primary` | `#2DD94C` | Main accent color (Vibrant Green) |
| `border-border` | `#222222` | Subtle borders for separation |

## Typography
Font Family: **Inter**

| Scale | Class | Size | Weight |
|-------|-------|------|--------|
| Heading XL | `text-4xl font-bold` | 36px | 700 |
| Heading LG | `text-3xl font-bold` | 30px | 700 |
| Heading MD | `text-2xl font-semibold` | 24px | 600 |
| Body | `text-base font-normal` | 16px | 400 |
| Caption | `text-sm text-gray-400` | 14px | 400 |

## Spacing System
Base unit: 4px
| Value | Pixels | Tailwind Class |
|-------|--------|----------------|
| 2 | 8px | `p-2` / `m-2` |
| 3 | 12px | `p-3` / `m-3` |
| 4 | 16px | `p-4` / `m-4` |
| 6 | 24px | `p-6` / `m-6` |
| 8 | 32px | `p-8` / `m-8` |
| 12 | 48px | `p-12` / `m-12` |
| 16 | 64px | `p-16` / `m-16` |

## Border Radius
| Size | Value | Class |
|------|-------|-------|
| SM | 6px | `rounded-sm` |
| MD | 12px | `rounded-md` |
| LG | 16px | `rounded-lg` |

## Components
### Card
- Background: `bg-surface`
- Border: `border border-border`
- Radius: `rounded-md`
- Shadow: `shadow-card`
- Hover: `hover:shadow-card-hover hover:border-primary/50` transition-all

### Container
- Max Width: `max-w-6xl`
- Centered: `mx-auto`
- Padding: `px-4`
