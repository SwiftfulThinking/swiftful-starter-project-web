# Theme Configuration Guide

This project uses a centralized theme system that makes it easy to customize colors across all shadcn/ui components.

## Quick Start

1. **Using the Theme Switcher**
   - Look for the palette icon in the header
   - Click to see available themes (Neutral, Blue, Green, Purple)
   - Select a theme to instantly update all components

2. **Customizing Colors**
   - Edit `/src/lib/theme-colors.ts`
   - Colors use HSL format: `"hue saturation% lightness%"`
   - Each theme has light and dark mode variants

## Creating a Custom Theme

1. Open `/src/lib/theme-colors.ts`
2. Copy an existing theme object
3. Modify the HSL values:

```typescript
myCustomTheme: {
  light: {
    background: "0 0% 100%",        // White background
    foreground: "0 0% 0%",          // Black text
    primary: "259 100% 51%",        // Custom purple
    "primary-foreground": "0 0% 100%",
    // ... other colors
  },
  dark: {
    background: "0 0% 10%",         // Dark background
    foreground: "0 0% 100%",        // White text
    primary: "259 100% 61%",        // Lighter purple for dark mode
    // ... other colors
  }
}
```

## Color Variables

### Core Colors
- `background` - Main background color
- `foreground` - Main text color
- `primary` - Primary brand color
- `secondary` - Secondary brand color
- `accent` - Accent color for highlights
- `muted` - Muted backgrounds and text
- `destructive` - Error/danger states

### UI Element Colors
- `card` - Card backgrounds
- `popover` - Popover backgrounds
- `border` - Border colors
- `input` - Input field borders
- `ring` - Focus ring color

### Chart Colors
- `chart-1` through `chart-5` - Data visualization colors

## HSL Color Format

HSL makes it easy to create consistent color palettes:
- **Hue** (0-360): The color wheel position
- **Saturation** (0-100%): Color intensity
- **Lightness** (0-100%): How light or dark

Examples:
- `"0 0% 100%"` = White
- `"0 0% 0%"` = Black
- `"220 90% 50%"` = Vibrant blue
- `"120 60% 40%"` = Forest green

## Tips

1. **Maintain Contrast**: Ensure sufficient contrast between foreground and background colors for accessibility
2. **Test Both Modes**: Always check your theme in both light and dark modes
3. **Use Color Tools**: Tools like [HSL Color Picker](https://hslpicker.com) can help you find the right values
4. **Keep Consistency**: Use similar saturation levels across your color palette for a cohesive look

## Applying Themes Programmatically

```typescript
import { applyTheme } from '@/lib/theme-colors'

// Apply a theme
applyTheme('blue', false)  // Blue theme, light mode
applyTheme('green', true)  // Green theme, dark mode

// Get theme colors as an object
import { getThemeColors } from '@/lib/theme-colors'
const colors = getThemeColors('purple', false)
```