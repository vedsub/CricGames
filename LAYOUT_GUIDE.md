# CricGames Unified Layout Guide

This document defines the standard layout and design principles for the CricGames application, ensuring consistency with the `playauctiongame.com` aesthetic.

## 1. Global Layout Containers

### Page Structure
All pages must use the `PageContainer` component to ensure consistent max-width and centering.

```jsx
import PageContainer from '../components/PageContainer';

function MyPage() {
  return (
    <PageContainer>
       {/* Page Content */}
    </PageContainer>
  );
}
```

- **Max Width**: `max-w-6xl` (approx 1152px) for the main wrapper.
- **Padding**: `px-6` (24px) on horizontal, `py-12` (48px) on vertical.
- **Background**: `#0b0b0b` (Global Body Background).

### Navigation & Footer
- **Navbar**: Fixed height (`72px`), `max-w-6xl` content area centered.
- **Footer**: Top border (`border-border`), `max-w-6xl` content area centered.

## 2. Component Standards

### Cards (`Card.jsx`)
The primary container for content.

- **Background**: `bg-surface` (`#161616`)
- **Border**: `border border-border` (`#222222`)
- **Radius**: `rounded-lg`
- **Variants**:
  - `default`: Static content.
  - `interactive`: Hover effects (`hover:border-primary/30`, `hover:-translate-y-1`).

### Typography Hierarchy

| Element | Class | Color | Usage |
| :--- | :--- | :--- | :--- |
| **Page Title** | `text-3xl font-bold` | `text-white` | Main page heading |
| **Subtitle** | `text-sm` | `text-gray-400` | Below page title |
| **Card Header** | `text-xl font-bold` | `text-white` | Section or Game title |
| **Body Text** | `text-sm` | `text-gray-400` | Descriptions |
| **Accent Text** | `font-bold` | `text-primary` | Stats, correct answers |
| **Labels** | `text-xs uppercase font-bold` | `text-gray-500` | Metadata labels |

### Colors (Tailwind Tokens)

- **Primary**: `text-primary` / `bg-primary` (`#2DD94C`) - Actions, Success
- **Background**: `bg-background` (`#0b0b0b`) - Application base
- **Surface**: `bg-surface` (`#161616`) - Cards, Modals
- **Surface Hover**: `bg-surface-hover` (`#1e1e1e`) - Interactive states
- **Border**: `border-border` (`#222222`) - Dividers, Outlines

## 3. Game UI Patterns

### Mode Selection (e.g. Box Cricket)
- Use a **centered Card** with stacked vertical options.
- Icon on left, Title + Description on right.
- `hover:bg-surface-hover` for interactivity.

### Focused Game (e.g. Tenaball, Who Are You)
- Limit width to **`max-w-xl`** or **`max-w-lg`** to maintain focus.
- Integrate **Stats** (Lives/Score) into the Card header.
- Input fields should be full-width within the card.

## 4. Iconography
- Use **`lucide-react`** for all icons.
- Stroke width: default (2px) or 1.5px for cleaner look.
- Color: `text-gray-400` for neutral, `text-primary` for active.

## 5. Responsiveness
- **Desktop**: Centered `max-w-6xl`.
- **Mobile**: `px-6` horizontal padding. Stack grids to single column (`grid-cols-1`).
- **Navbar**: Collapses to Hamburger menu on mobile.
