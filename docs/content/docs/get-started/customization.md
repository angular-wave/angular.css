---
title: Customization
weight: 40
description:
  Configure AngularCSS colors, spacing, typography, shadows, radii, density,
  focus, and motion with ordinary CSS or DTCG-compatible tools.
---

AngularCSS is a customization system, not a design system. It supplies a
consistent functional baseline and stable presentation controls. Your
application still decides its brand, visual language, content hierarchy, and
product-specific composition.

Every browser-facing customization control is a CSS custom property. Consumers
do not need a token compiler, Tailwind, Sass, JavaScript, or an AngularCSS build
step to change the defaults.

## Load order

Load AngularCSS before application styles. The bundle declares this low-to-high
layer order: `base`, `angularcss.tokens`, `angularcss.components`, `components`,
and `utilities`.

```css
@import "@angular-wave/angular.css/angular.css";

@layer components {
  :root {
    --primary: #175cd3;
    --primary-foreground: #fff;
    --radius: 0.375rem;
  }
}
```

Unlayered application rules remain above normal layered declarations. Use the
public `components` layer for reusable application rules and `utilities` for
local exceptions.

## Customization token format

AngularCSS authors its defaults as Design Tokens Community Group 2025.10 token
files. The package exports the resolver at
`@angular-wave/angular.css/customization-tokens` for design, documentation, and
translation tools.

The generated CSS variables remain the runtime API. The DTCG files improve
interoperability and validation; they do not turn AngularCSS into a design
system or require applications to adopt a token tool.

The customization families are:

- **Colors:** semantic surfaces, content, actions, states, charts, sidebar, and
  compatibility palettes.
- **Spacing:** the base rhythm and an explicit spacing scale.
- **Typography:** font families, sizes, weights, and line heights.
- **Shadows:** elevation values for controls, panels, menus, and dialogs.
- **Radii:** control, surface, overlay, and fully rounded geometry.
- **Sizing:** control heights, icon sizes, and the minimum comfortable pointer
  target.
- **Borders and focus:** shared widths and visible keyboard-focus geometry.
- **Motion:** shared durations and easing curves.

## Global customization

Set semantic variables on `:root` to configure the entire application:

```css
:root {
  --background: #fff;
  --foreground: #17202a;
  --primary: #175cd3;
  --primary-foreground: #fff;
  --border: #d0d5dd;
  --input: #98a2b3;
  --ring: #528bff;

  --spacing: 0.25rem;
  --font-sans: Inter, system-ui, sans-serif;
  --text-sm: 0.875rem;
  --font-weight-medium: 500;
  --shadow-md: 0 4px 8px rgb(16 24 40 / 12%);
  --radius: 0.375rem;
}
```

Components consume semantic variables such as `--background`, `--primary`, and
`--border`. Palette variables such as `--blue-9` remain available when an
application needs a concrete value, but component rules do not require a
specific brand palette.

## Scoped customization

Custom properties inherit, so an application region can use different
presentation settings without copying component selectors:

```css
.operations-console {
  --spacing: 0.2rem;
  --radius: 0.25rem;
  --size-control-md: 2rem;
  --shadow-md: 0 2px 5px rgb(16 24 40 / 10%);
}
```

Use scoped values for embedded tools, dense administrative areas, or gradual
brand migrations. Keep focus indicators and pointer targets usable when reducing
density.

## Density contexts

Set `data-density` on the application root or a subtree to apply a coordinated
spacing and control-geometry preset. The attribute changes the same public
variables that applications can set directly.

```html
<section data-density="compact">
  <!-- Dense administrative workspace -->
</section>
```

`compact` favors information-dense pointer workflows. `comfortable` increases
spacing and target sizes for lower-density forms and touch-oriented areas. The
default context remains between the two. Applications can override any mapped
variable after the preset.

## Contrast contexts

AngularCSS responds to `prefers-contrast: more` by strengthening borders,
control outlines, and focus rings. Use `data-contrast="more"` to request the
same treatment for a subtree independent of the operating-system preference:

```html
<main data-contrast="more">...</main>
```

The context maps semantic variables and therefore follows customized light and
dark colors instead of imposing a separate palette.

## Print contexts

Print styles remove shadows and motion, preserve readable light surfaces, and
let scrollable tables and data regions expand. Mark application-only controls
with `data-print="exclude"`; mark print-only content with `data-print="only"`.

```html
<button data-print="exclude">Edit</button>
<p data-print="only">Generated from the current customer record.</p>
```

These attributes express document intent in HTML and work across components.

## Dark contexts

Add `dark` to any ancestor. AngularCSS provides dark defaults for the same
semantic variables:

```html
<section class="dark">
  <button>Continue</button>
</section>
```

Override variables inside the same selector to supply an application-specific
dark presentation:

```css
.dark {
  --background: #101828;
  --foreground: #f2f4f7;
  --primary: #84adff;
  --primary-foreground: #102a56;
}
```

## Selectors, parts, and state

Use documented root selectors, semantic descendants, native state, and
documented component state for customization beyond the shared variables:

```css
.dialog > dialog {
  max-width: 48rem;
}

[ng-tabs] > menu > button[aria-selected="true"] {
  border-color: var(--primary);
}
```

Styling-only entries keep state in native selectors such as `:checked`,
`:disabled`, and `:open`. Behavioral components expose authored attributes, ARIA
state, and documented `data-*` state. Avoid selectors based on generated IDs or
child positions.

## Tailwind and other CSS tools

AngularCSS has no Tailwind dependency. Tailwind, Sass, CSS Modules, and other
application toolchains can set the same custom properties or add rules in the
public cascade layers. They do not need an AngularCSS-specific customization
model.

## Preserve behavior

Customization may change spacing, color, typography, borders, geometry, shadows,
and motion. Keep focused elements visible, preserve keyboard focus, retain
usable contrast and pointer targets, and keep visual order aligned with DOM
order.

Use the [component catalog]({{< relref "/docs/components">}}) to find each
component's selectors, states, custom properties, and live source.
