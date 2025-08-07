# Tailwind CSS Setup for Skibidi Toilet Theme

This project now has Tailwind CSS v4 installed with the `tw-` prefix to avoid conflicts with the existing Impact theme styles.

## Setup Complete

- ✅ Tailwind CSS v4 installed
- ✅ PostCSS configured with Autoprefixer
- ✅ All Tailwind classes prefixed with `tw-`
- ✅ Preflight styles disabled to avoid conflicts
- ✅ Build scripts configured
- ✅ CSS file included in theme layout

## Available NPM Scripts

```bash
# Build Tailwind CSS once
npm run build-css

# Watch for changes and rebuild automatically (recommended for development)
npm run watch-css

# Build minified version for production
npm run build-css-min
```

## Usage

All Tailwind classes must be prefixed with `tw-`. Examples:

```html
<!-- Standard Tailwind -->
<div class="bg-blue-500 text-white p-4">

<!-- With tw- prefix (what you should use) -->
<div class="tw-bg-blue-500 tw-text-white tw-p-4">
```

## Files Structure

- `tailwind.config.js` - Tailwind configuration with prefix and content paths
- `postcss.config.js` - PostCSS configuration
- `assets/tailwind.css` - Source Tailwind CSS file
- `assets/tailwind.output.css` - Compiled CSS file (auto-generated)

## Development Workflow

1. Start the watch command: `npm run watch-css`
2. Use `tw-` prefixed classes in your liquid templates
3. The CSS will automatically rebuild when you save changes
4. For production builds, use `npm run build-css-min`

## Custom Styles

Add custom styles to `assets/tailwind.css` after the Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom Skibidi Toilet styles here */
.tw-skibidi-special {
  /* custom styles */
}
```

## Important Notes

- Preflight is disabled to avoid conflicts with existing theme styles
- The compiled CSS is loaded after all existing theme CSS files
- Always use the `tw-` prefix for all Tailwind classes
- Remember to run the build command before deploying changes
